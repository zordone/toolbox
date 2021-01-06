import React, { useCallback } from "react";
import Formatter from "../components/Formatter";
import { usePersistedState } from "../persistedState";
import { useSettings } from "../settings";
import { reindent, setToolMeta } from "../utils";

const initialCode = `
      const foo = 'hello';
      if (const) {
        console.log(foo);
      }
`;

const Unindent = ({ pasted }) => {
  const [code, setCode] = usePersistedState(Unindent, "code", undefined);
  const settings = useSettings(Unindent);

  const onValidate = useCallback(
    (value) => ({ value: reindent(value, settings.leading) }),
    [settings]
  );

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

setToolMeta(Unindent, {
  name: "Unindent",
  description: "Unindent JavaScript code or other indented text.",
  settings: [
    { key: "leading", title: "Leading spaces", type: "integer", initial: 0 },
  ],
});

export default Unindent;
