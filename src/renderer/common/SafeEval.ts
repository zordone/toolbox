// 3rd party packages are abandoned and/or have critical vulnerabilities.
// this is my own safe-ish eval solution for the code playgrounds.
// it's using the safer Function-based method, and it's inside a sandboxed iframe.

import { reindent } from "../utils";

// source of the iframe:
// - listens for a message main window, including an expression and a context object.
// - unpacks the context, by creating a top level `let` declaration for each key in the context.
// - appends the expression as a return statement.
// - creates a function to run the code.
// - sends the result or error back to the main window.
const iframeSrc = reindent(`
  <!DOCTYPE html>
  <html>
    <head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js" integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>    
      <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.30.0/moment.min.js" integrity="sha512-Zld6cksVzVRF8ZJIbU4Or5vo47P1/Wg3U/c15iMudpFIExUKZlyHPB+i7+Wov3jfRMBECsn/MgqBPpfAJANHXw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      <script>
        window.addEventListener('message', (event) => {
          const { source: mainWindow, origin, data } = event;
          const { context, expression } = data;                
          const code = [        
            ...Object.keys(context).map(key => 'let ' + key + ' = context[' + JSON.stringify(key) + '];'),
            'return ' + expression + ';',
          ].join('\\n');
  
          const result = {};        
          try {
            result.value = Function('context', code).call(null, context);
          } catch (error) {
            result.error = error;
          }            
          mainWindow.postMessage(result, origin);
        });
      </script>
    </head>
  </html>
`);

// create a hidden iframe with the source above
const iframe = document.createElement("iframe");
iframe.setAttribute("srcdoc", iframeSrc);
iframe.setAttribute("sandbox", "allow-scripts");
iframe.setAttribute("style", "display: none");
document.body.appendChild(iframe);

// evaluates a JavaScript expression, with the provided context:
// await safeEval("a+b", { a: 1, b: 2 }); // -> 3
export const safeEval = async <T = unknown>(
  expression: string,
  context: object,
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    window.addEventListener(
      "message",
      ({ origin, source, data }) => {
        if (origin === "null" && source === iframe.contentWindow) {
          const { value, error } = data;
          if (error) {
            reject(error);
          } else {
            resolve(value);
          }
        }
      },
      { once: true },
    );

    iframe.contentWindow?.postMessage({ expression, context }, "*");
  });
};
