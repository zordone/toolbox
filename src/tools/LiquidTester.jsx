import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Liquid } from "liquidjs";
import Formatter from "../components/Formatter";
import { FieldLabel, TextField } from "../components/Fields";
import { CopyButton, PasteButton } from "../components/Buttons";
import { formatJson, setToolMeta, displayName } from "../utils";
import { usePersistedState } from "../persistedState";

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

const LiquidTester = ({ pasted }) => {
  const [json, setJson] = usePersistedState(LiquidTester, "json", initialJson);
  const [expr, setExpr] = usePersistedState(LiquidTester, "expr", initialExpr);
  const [result, setResult] = useState("");

  const onValidate = useCallback((value) => {
    try {
      const newValue = formatJson(JSON.parse(value));
      return { value: newValue };
    } catch (ex) {
      setResult("");
      return { error: ex.message };
    }
  }, []);

  useEffect(() => {
    const context = JSON.parse(json) || {};
    engine.parseAndRender(expr, context).then(setResult);
  }, [json, expr]);

  return (
    <Grid>
      <FieldLabel area="lexp">Liquid Expression</FieldLabel>
      <CopyButton area="copy" name="expression" state={expr} />
      <PasteButton area="past" name="expression" setState={setExpr} />
      <TextField area="fexp" state={expr} setState={setExpr} monoSpace />

      <FieldLabel area="lres">Result</FieldLabel>
      <TextField area="fres" state={result} monoSpace readOnly />

      <Formatter
        area="fctx"
        pasted={pasted}
        title="Context JSON"
        name="JSON"
        state={json}
        setState={setJson}
        onValidate={onValidate}
        mode="json"
      />
    </Grid>
  );
};

setToolMeta(LiquidTester, {
  name: "LiquidTester",
  description: "Liquid expression tester.",
});

export default LiquidTester;
