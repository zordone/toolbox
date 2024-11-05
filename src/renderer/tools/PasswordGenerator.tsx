import React, { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Button, { CopyButton } from "../common/Buttons";
import { TextField } from "../fields";
import { SettingsRecord, useSettings } from "../settings";
import { registerTool, ToolProps } from "../toolStore";
import { displayName } from "../utils";

// noinspection SpellCheckingInspection
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
  `,
);

interface Settings extends SettingsRecord {
  length: number;
  specials: number;
}

const PasswordGenerator: FC<ToolProps> = () => {
  const [pass, setPass] = useState("");
  const { length, specials } = useSettings<Settings>(PasswordGenerator);

  const generate = useCallback(() => {
    const chars = NORMAL_CHARS.split("");
    const specs = SPECIAL_CHARS.split("");
    const pickChar = () =>
      chars.splice(Math.trunc(Math.random() * chars.length), 1)[0];
    const pickSpec = () =>
      specs.splice(Math.trunc(Math.random() * specs.length), 1)[0];
    const pass = Array(length - specials)
      .fill(0)
      .map(pickChar);
    for (let i = 0; i < specials; i++) {
      const index = Math.random() * pass.length;
      pass.splice(index, 0, pickSpec());
    }
    setPass(pass.join(""));
  }, [length, specials]);

  useEffect(generate, [generate]);

  return (
    <Grid>
      <Button onClick={generate}>Generate</Button>
      <TextField
        monoSpace={true}
        readOnly={true}
        setState={setPass}
        state={pass}
      />
      <CopyButton name="password" state={pass} />
    </Grid>
  );
};

registerTool({
  component: PasswordGenerator,
  name: "PasswordGenerator",
  description: "Random password generator.",
  settings: [
    {
      key: "length",
      title: "Password length",
      type: "integer",
      initial: 16,
    },
    {
      key: "specials",
      title: "Special characters",
      type: "integer",
      initial: 2,
    },
  ],
});
