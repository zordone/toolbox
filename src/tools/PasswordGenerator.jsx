import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { TextField } from "../components/Fields";
import Button, { CopyButton } from "../components/Buttons";
import { displayName } from "../utils";

const LENGTH = 16;
const SPECIALS = 2;
const NORMAL_CHARS =
  "abcdefghijklmnopqrstuvwxyz" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "0123456789" +
  "0123456789";
const SPECIAL_CHARS = "_-+:;!#()[]{}.,$£/|=@‹›~^";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 0fr 20rem 0fr;
    gap: var(--gap-size);
  `
);

const PasswordGenerator = () => {
  const [pass, setPass] = useState("");

  const generate = useCallback(() => {
    const chars = NORMAL_CHARS.split("");
    const specs = SPECIAL_CHARS.split("");
    const pickChar = () =>
      chars.splice(Math.trunc(Math.random() * chars.length), 1)[0];
    const pickSpec = () =>
      specs.splice(Math.trunc(Math.random() * specs.length), 1)[0];
    const pass = Array(LENGTH - SPECIALS)
      .fill(0)
      .map(pickChar);
    for (let i = 0; i < SPECIALS; i++) {
      const index = Math.random() * pass.length;
      pass.splice(index, 0, pickSpec());
    }
    setPass(pass.join(""));
  }, []);

  useEffect(generate, [generate]);

  return (
    <Grid>
      <Button onClick={generate}>Generate</Button>
      <TextField
        state={pass}
        setState={setPass}
        readOnly={true}
        monoSpace={true}
      />
      <CopyButton name="password" state={pass} />
    </Grid>
  );
};

PasswordGenerator.displayName = "PasswordGenerator";

export default PasswordGenerator;
