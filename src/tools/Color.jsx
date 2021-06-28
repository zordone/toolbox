import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  CopyButton,
  IconButton,
  OnOfffButton,
  PasteButton,
} from "../components/Buttons";
import {
  FieldLabel,
  FloatField,
  IntegerField,
  TextField,
} from "../components/Fields";
import Aspect from "../components/Aspect";
import { cssGridArea } from "../components/styledCss";
import {
  displayName,
  limit,
  matchGroups,
  roundTo,
  setToolMeta,
} from "../utils";
import { usePersistedState } from "../persistedState";

const reRgba =
  /^rgba?\((?<r>\d+),\s*(?<g>\d+),\s*(?<b>\d+)(|,\s*(?<a>[\d.]+))\)$/;
const reShortable = /^#(\w)\1(\w)\2(\w)\3(?:(\w)\4)?$/;
const reHsla = /^hsl\((\d+)\s+?(\d+)%\s+?(\d+)%\s*\/?\s*([\d.]+)?\)$/;

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: minmax(10rem, 22rem) 0fr;
    grid-template-rows: 0fr 1fr;
    grid-auto-flow: column;
    gap: var(--gap-size);
  `
);

const Preview = displayName(
  "Preview",
  styled.div`
    position: absolute;
    border-radius: var(--border-radius);
    overflow: hidden;

    ${({ $coords = "0,0,0,0" }) => {
      const [top, left, bottom, right] = $coords.split(",");
      return `
        top: ${top}%;
        left: ${left}%;
        bottom: ${bottom}%;
        right: ${right}%;
      `;
    }}

    ${({ $isBackdrop, $color, $isOn = true }) => {
      if ($isBackdrop) {
        return `
          background-color: #C0C0C0;
          background-image: 
            linear-gradient(45deg, #404040 25%, transparent 25%), 
            linear-gradient(-45deg, #404040 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #404040 75%), 
            linear-gradient(-45deg, transparent 75%, #404040 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        `;
      }
      return `
        background: ${$isOn ? $color : "transparent"};
      `;
    }}

    ${({ $isSelected, $isHover }) =>
      $isSelected &&
      $isHover &&
      `
        border: 0.1rem dashed #fff;
    `}
  `
);

const EditorGrid = displayName(
  "EditorGrid",
  styled.div`
    display: grid;
    grid-template-columns: 0fr 1fr 0fr;
    grid-template-areas:
      "plab part  pon"
      "sep1 sep1  sep1"
      "clab color cclip"
      "sep2 sep2  sep2"
      "hlab hue   hbtn"
      "slab sat   sbtn"
      "llab lig   lbtn"
      "alab alp   abtn"
      "sep3 sep3  sep3";
    gap: var(--gap-size);
    width: fit-content;
    min-width: 25rem;
  `
);

const Cell = displayName(
  "Cell",
  styled.div`
    display: flex;
    gap: var(--gap-size);
  `
);

const Separator = displayName(
  "Separator",
  styled.div`
    ${cssGridArea}
    height: 0.1rem;
    background: var(--main-fg);
    opacity: 0.2;
  `
);

const parts = [
  { name: "bg", coords: "0,0,0,0", initial: "#1e4313e0" },
  { name: "left", coords: "10,10,10,50", initial: "#22a152" },
  { name: "right", coords: "10,50,10,10", initial: "#1fcc61" },
  { name: "center", coords: "25,25,25,25", initial: "#117030" },
];

// `css` can be any kind of color: hex, rgba, hsla, keyword, etc
const cssToRgba = (css) => {
  const temp = document.createElement("div");
  temp.style.color = css;
  document.body.appendChild(temp);
  if (!temp.style.color) {
    return undefined;
  }
  const cs = window.getComputedStyle(temp);
  const rgbaString = cs.getPropertyValue("color");
  document.body.removeChild(temp);

  let rgba;
  matchGroups(rgbaString, reRgba, ({ r, b, g, a }) => {
    rgba = [r, g, b, a]
      .map((ch) => (ch ? Number(ch) : undefined))
      .filter((ch) => ch !== undefined);
  });
  return rgba;
};

const rgbaToHex = (rgba) => {
  if (!rgba) {
    return "";
  }
  const parsed = rgba.map((ch, index) => {
    if (index === 3) {
      ch = ch && Math.round(ch * 255);
    }
    return ch === undefined ? undefined : ch.toString(16).padStart(2, "0");
  });

  return ["#", ...parsed].join("").replace(reShortable, "#$1$2$3$4");
};

const rgbaToRgbaString = (rgba) =>
  rgba
    ? [rgba.length === 4 ? "rgba(" : "rgb(", rgba.join(", "), ")"].join("")
    : "";

const rgbaToHsla = (rgba) => {
  if (!rgba) {
    return;
  }
  const rgb = rgba.slice(0, 3).map((ch) => ch / 255);
  const alpha = rgba[3];
  const max = Math.max(...rgb);
  const min = Math.min(...rgb);

  let h;
  let s;
  let l = (max + min) / 2;

  if (max === min) {
    // achromatic
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    const [r, g, b] = rgb;
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return [h, s, l, alpha || 1.0];
};

const hslaToHslaString = (hsla) => {
  if (!hsla) {
    return "";
  }
  const [h, s, l, a = 1] = hsla;
  return [`hsl(${h} ${s}% ${l}%`, a < 1 ? ` / ${a}` : "", ")"].join("");
};

const hslaStringToHsla = (str) => {
  if (!str.match(reHsla)) {
    return;
  }
  const hsla = str
    .replace(reHsla, "$1,$2,$3,$4")
    .split(",")
    .filter(Boolean)
    .map(Number);
  if (hsla.length === 3) {
    hsla.push(0);
  }
  return hsla;
};

const colorToHsla = (color) =>
  hslaStringToHsla(color) || rgbaToHsla(cssToRgba(color)) || [];

const hslaFields = [
  { key: "h", label: "Hue", step: 1, max: 360, Field: IntegerField },
  { key: "s", label: "Sat", step: 1, max: 100, Field: IntegerField },
  { key: "l", label: "Light", step: 1, max: 100, Field: IntegerField },
  { key: "a", label: "Alpha", step: 0.01, max: 1, fixed: 2, Field: FloatField },
];

const Color = () => {
  const [selected, setSelected] = usePersistedState(
    Color,
    "selected",
    "center"
  );
  const selectedRef = useRef();
  const [colors, setColors] = usePersistedState(
    Color,
    "colors",
    Object.fromEntries(parts.map(({ name, initial }) => [name, initial]))
  );
  const [toggles, setToggles] = usePersistedState(
    Color,
    "toggles",
    Object.fromEntries(parts.map(({ name }) => [name, true]))
  );

  const [isHover, setIsHover] = useState(false);

  const [hex, setHex] = useState();
  const [rgbaString, setRgbaString] = useState();
  const [hslaString, setHslaString] = useState();

  const [hsla, setHsla] = useState([]);
  const hslaRef = useRef(hsla);

  // set any color format
  const setColor = useCallback((color) => {
    const hsla = colorToHsla(color);
    setHsla(hsla);
  }, []);

  // set one channel of HSLA
  const setHslaPart = useCallback(
    (index, value = "") => {
      if (value === "") {
        return;
      }
      const newHsla = [...hsla];
      newHsla[index] = Number(value);
      setHsla(newHsla);
    },
    [hsla]
  );

  const stepHslaPart = useCallback(
    (index, sign) => {
      const { step, max, min = 0, fixed = 0 } = hslaFields[index];
      const newVal = roundTo(limit(hsla[index] + sign * step, min, max), fixed);
      setHslaPart(index, newVal);
    },
    [hsla, setHslaPart]
  );

  // selection change -> set HSLA
  useEffect(() => {
    if (selected !== selectedRef.current) {
      const hsla = colorToHsla(colors[selected]);
      setHsla(hsla);
      selectedRef.current = selected;
    }
  }, [colors, selected]);

  // HSLA change -> convert to everything, set preview color
  useEffect(() => {
    if (hsla !== hslaRef.current) {
      const hslaString = hslaToHslaString(hsla);
      const rgba = cssToRgba(hslaString);
      const rgbaString = rgbaToRgbaString(rgba);
      const hex = rgbaToHex(rgba);

      setHex(hex);
      setRgbaString(rgbaString);
      setHslaString(hslaString);

      if (hex) {
        setColors((curentColors) => ({
          ...curentColors,
          [selected]: hex,
        }));
      }

      hslaRef.current = hsla;
    }
  }, [hsla, selected, setColors]);

  const copyFields = [
    { name: "Hex", state: hex },
    { name: "RGBA", state: rgbaString },
    { name: "HSLA", state: hslaString },
  ];

  return (
    <Grid>
      <FieldLabel>Select part to edit</FieldLabel>
      <Aspect
        aspectRatio="1:1"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Preview $coords="0,0,0,0" $isBackdrop />
        {parts.map(({ name, coords }) => (
          <Preview
            key={name}
            $coords={coords}
            $color={colors[name]}
            $isSelected={selected === name}
            $isOn={toggles[name]}
            $isHover={isHover}
            onClick={() => setSelected(name)}
          />
        ))}
      </Aspect>
      <FieldLabel>Selected</FieldLabel>
      <EditorGrid>
        <FieldLabel>Part</FieldLabel>
        <TextField state={selected} readOnly />
        <OnOfffButton
          state={toggles[selected]}
          setState={(value) => setToggles({ ...toggles, [selected]: value })}
        />

        <Separator area="sep1" />

        <FieldLabel>Color</FieldLabel>
        <TextField state={colors[selected]} setState={setColor} monoSpace />
        <Cell>
          <CopyButton name="color" state={colors[selected]} />
          <PasteButton name="color" setState={setColor} />
        </Cell>

        <Separator area="sep2" />

        {hslaFields.map(({ key, label, Field }, index) => (
          <React.Fragment key={key}>
            <FieldLabel>{label}</FieldLabel>
            <Field
              state={hsla[index]}
              setState={(val) => setHslaPart(index, val)}
            />
            <Cell>
              <IconButton
                icon="fa-chevron-left"
                fullWidth
                onClick={() => stepHslaPart(index, -1)}
              />
              <IconButton
                icon="fa-chevron-right"
                fullWidth
                onClick={() => stepHslaPart(index, +1)}
              />
            </Cell>
          </React.Fragment>
        ))}

        <Separator area="sep3" />

        {copyFields.map(({ name, state }) => (
          <React.Fragment key={name}>
            <FieldLabel>{name}</FieldLabel>
            <TextField state={state} readOnly monoSpace />
            <CopyButton name={name} state={state} />
          </React.Fragment>
        ))}
      </EditorGrid>
    </Grid>
  );
};

setToolMeta(Color, {
  name: "Color",
  description: "Color converter and preview.",
});

export default Color;
