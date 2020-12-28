import React, { useCallback } from "react";
import Formatter from "../components/Formatter";
import { usePersistedState } from "../persistedState";
import { formatJson } from "../utils";

const initialJson = formatJson({
  hello: "world",
  foo: {
    id: "foo-1",
    value: 42,
  },
});

const JsonFormatter = ({ pasted }) => {
  const [json, setJson] = usePersistedState(JsonFormatter, "json", initialJson);

  const onValidate = useCallback((value) => {
    try {
      const newValue = formatJson(JSON.parse(value));
      return { value: newValue };
    } catch (ex) {
      return { error: ex.message };
    }
  }, []);

  return (
    <Formatter
      pasted={pasted}
      title="Edit your JSON:"
      name="JSON"
      state={json}
      setState={setJson}
      onValidate={onValidate}
      mode="json"
    />
  );
};

export default JsonFormatter;
