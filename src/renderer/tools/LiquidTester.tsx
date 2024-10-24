import { Liquid } from "liquidjs";
import React, { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { CopyButton, PasteButton } from "../common/Buttons";
import { FieldLabel, TextField } from "../fields";
import { usePersistedState } from "../persistedState";
import Formatter from "../templates/Formatter";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, formatJson } from "../utils";

const engine = new Liquid();

const initialJson = formatJson({
  number: 42,
});

const initialExpr = "{% if number == 42 %}YES{% else %}NO{% endif %}";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 0fr 0fr 0fr 0fr 1fr;
    grid-template-areas:
      "lexp copy past"
      "fexp fexp fexp"
      "lres lres lres"
      "fres fres fres"
      "fctx fctx fctx";
    gap: var(--gap-size);
    height: 100%;
  `
);

const LiquidTester: FC<ToolProps> = ({ pasted }) => {
  const [json, setJson] = usePersistedState(LiquidTester, "json", initialJson);
  const [expr, setExpr] = usePersistedState(LiquidTester, "expr", initialExpr);
  const [result, setResult] = useState("");

  const onValidate = useCallback((value: string) => {
    try {
      const newValue = formatJson(JSON.parse(value));
      return { value: newValue, error: null };
    } catch (ex) {
      setResult("");
      return { value: "", error: ex.message };
    }
  }, []);

  useEffect(() => {
    const context = JSON.parse(json) || {};
    engine.parseAndRender(expr, context).then(setResult);
  }, [json, expr]);

  return (
    <Grid>
      <FieldLabel $area="lexp">Liquid Expression</FieldLabel>
      <CopyButton area="copy" name="expression" state={expr} />
      <PasteButton area="past" name="expression" setState={setExpr} />
      <TextField area="fexp" monoSpace setState={setExpr} state={expr} />

      <FieldLabel $area="lres">Result</FieldLabel>
      <TextField area="fres" monoSpace readOnly state={result} />

      <Formatter
        area="fctx"
        mode="json"
        name="JSON"
        onValidate={onValidate}
        pasted={pasted}
        setState={setJson}
        state={json}
        title="Context JSON"
      />
    </Grid>
  );
};

registerTool({
  component: LiquidTester,
  name: "LiquidTester",
  description: "Liquid expression tester.",
});

export default LiquidTester;
