import React, { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Button, { CopyButton } from "../common/Buttons";
import { TextField } from "../fields";
import { registerTool, ToolProps } from "../toolStore";
import { displayName } from "../utils";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 0fr 25rem 0fr;
    gap: var(--gap-size);
  `
);

const Uuid: FC<ToolProps> = () => {
  const [uuid, setUuid] = useState("");

  const generate = useCallback(() => {
    setUuid(crypto.randomUUID());
  }, []);

  useEffect(generate, [generate]);

  return (
    <Grid>
      <Button onClick={generate}>Generate</Button>
      <TextField
        monoSpace={true}
        readOnly={true}
        setState={setUuid}
        state={uuid}
      />
      <CopyButton name="uuid" state={uuid} />
    </Grid>
  );
};

registerTool({
  component: Uuid,
  name: "Uuid",
  description: "UUID generator.",
});
