import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { TextField } from "../components/Fields";
import Button, { CopyButton } from "../components/Buttons";
import { displayName, setToolMeta } from "../utils";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 0fr 25rem 0fr;
    gap: var(--gap-size);
  `
);

const Uuid = () => {
  const [uuid, setUuid] = useState("");

  const generate = useCallback(() => {
    setUuid(crypto.randomUUID());
  }, []);

  useEffect(generate, [generate]);

  return (
    <Grid>
      <Button onClick={generate}>Generate</Button>
      <TextField
        state={uuid}
        setState={setUuid}
        readOnly={true}
        monoSpace={true}
      />
      <CopyButton name="uuid" state={uuid} />
    </Grid>
  );
};

setToolMeta(Uuid, {
  name: "Uuid",
  description: "UUID generator.",
});

export default Uuid;
