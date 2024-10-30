import React, { FC, useCallback } from "react";
import Formatter from "../templates/Formatter";
import { usePersistedState } from "../persistedState";
import { useSettings } from "../settings";
import { registerTool, ToolProps } from "../toolStore";
import { reindent } from "../utils";

const initialCode = `
      const foo = 'hello';
      if (const) {
        console.log(foo);
      }
`;

const Unindent: FC<ToolProps> = ({ pasted }) => {
  const [code, setCode] = usePersistedState(Unindent, "code", undefined);
  const settings = useSettings(Unindent);

  const onValidate = useCallback(
    (value: string) => ({
      value: reindent(value, settings.leading),
      error: null,
    }),
    [settings]
  );

  return (
    <Formatter
      initialCode={initialCode}
      mode="javascript"
      name="code"
      onValidate={onValidate}
      pasted={pasted}
      setState={setCode}
      state={code}
      title="Edit your code"
    />
  );
};

registerTool({
  component: Unindent,
  name: "Unindent",
  description: "Unindent JavaScript code or other indented text.",
  settings: [
    {
      key: "leading",
      title: "Leading spaces",
      type: "integer",
      initial: 0,
    },
  ],
});
