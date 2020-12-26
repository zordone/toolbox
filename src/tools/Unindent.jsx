import React, { useState, useCallback } from "react";
import Formatter from "../components/Formatter";
import { reindent } from "../utils";

const initialCode = `
      const foo = 'hello';
      if (const) {
        console.log(foo);
      }
`;

const Unindent = ({ pasted }) => {
  const [code, setCode] = useState();

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

export default Unindent;
