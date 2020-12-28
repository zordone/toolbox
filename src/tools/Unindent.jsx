import React, { useCallback } from "react";
import Formatter from "../components/Formatter";
import { usePersistedState } from "../persistedState";
import { reindent } from "../utils";

const initialCode = `
      const foo = 'hello';
      if (const) {
        console.log(foo);
      }
`;

const Unindent = ({ pasted }) => {
  const [code, setCode] = usePersistedState(Unindent, "code", undefined);

  const onValidate = useCallback((value) => ({ value: reindent(value) }), []);

  return (
    <Formatter
      pasted={pasted}
      title="Edit your code:"
      name="code"
      state={code}
      setState={setCode}
      initialCode={initialCode}
      onValidate={onValidate}
      mode="javascript"
    />
  );
};

Unindent.displayName = "Unindent";

export default Unindent;
