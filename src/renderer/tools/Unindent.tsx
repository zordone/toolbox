import React, { FC, useCallback } from "react";
import Formatter from "../templates/Formatter";
import { usePersistedState } from "../persistedState";
import { SettingsRecord, useSettings } from "../settings";
import { registerTool, ToolProps } from "../toolStore";
import { reindent } from "../utils";

const initialCode = `
      const foo = 'hello';
      if (const) {
        console.log(foo);
      }
`;

interface Settings extends SettingsRecord {
  leading: number;
}

const Unindent: FC<ToolProps> = ({ pasted }) => {
  const [code, setCode] = usePersistedState(Unindent, "code", "");
  const { leading } = useSettings<Settings>(Unindent);

  const onValidate = useCallback(
    (value: string) => ({
      value: reindent(value, leading),
      error: null,
    }),
    [leading],
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
