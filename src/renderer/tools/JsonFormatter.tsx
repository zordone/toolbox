import React, { FC, useCallback } from "react";
import Formatter from "../templates/Formatter";
import { usePersistedState } from "../persistedState";
import { registerTool, ToolProps } from "../toolStore";
import { formatJson } from "../utils";

const initialJson = formatJson({
  hello: "world",
  foo: {
    id: "foo-1",
    value: 42,
  },
});

const JsonFormatter: FC<ToolProps> = ({ pasted }) => {
  const [json, setJson] = usePersistedState(JsonFormatter, "json", initialJson);

  const onValidate = useCallback((value: string) => {
    try {
      const newValue = formatJson(JSON.parse(value));
      return { value: newValue, error: null };
    } catch (ex) {
      return { value: "", error: ex.message };
    }
  }, []);

  return (
    <Formatter
      mode="json"
      name="JSON"
      onValidate={onValidate}
      pasted={pasted}
      setState={setJson}
      state={json}
      title="Edit your JSON"
    />
  );
};

registerTool({
  component: JsonFormatter,
  name: "JsonFormatter",
  description: "JSON formatter and editor.",
});

export default JsonFormatter;
