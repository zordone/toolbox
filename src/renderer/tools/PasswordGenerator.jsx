import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { TextField } from "../components/Fields";
import Button, { CopyButton } from "../components/Buttons";
import { displayName, setToolMeta } from "../utils";
import { useSettings } from "../settings";

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
  const settings = useSettings(PasswordGenerator);

  const generate = useCallback(() => {
    const chars = NORMAL_CHARS.split("");
    const specs = SPECIAL_CHARS.split("");
    const pickChar = () =>
      chars.splice(Math.trunc(Math.random() * chars.length), 1)[0];
    const pickSpec = () =>
      specs.splice(Math.trunc(Math.random() * specs.length), 1)[0];
    const pass = Array(settings.length - settings.specials)
      .fill(0)
      .map(pickChar);
    for (let i = 0; i < settings.specials; i++) {
      const index = Math.random() * pass.length;
      pass.splice(index, 0, pickSpec());
    }
    setPass(pass.join(""));
  }, [settings]);

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

setToolMeta(PasswordGenerator, {
  name: "PasswordGenerator",
  description: "Random password generator.",
  settings: [
    { key: "length", title: "Password length", type: "integer", initial: 16 },
    {
      key: "specials",
      title: "Special characters",
      type: "integer",
      initial: 2,
    },
  ],
});

export default PasswordGenerator;
