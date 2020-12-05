import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { NumberField, RatioField, FieldLabel } from "../components/Fields";
import Button from "../components/Buttons";
import Icon from "../components/Icon";
import { patterns, matchGroups, gcd, displayName } from "../utils";

const WIDTH = "width";
const HEIGHT = "height";
const RATIO = "ratio";

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 0fr 10rem 0fr;
    gap: var(--gap-size);
  `
);

const Calculator = ({ isOn, onClick }) => {
  return (
    <Button
      {...{ isOn, onClick }}
      title="Set this field to be the calculated one"
    >
      <Icon name="fa-calculator" />
    </Button>
  );
};

const normalizeFraction = (numerator, denominator) => {
  const divider = gcd(numerator, denominator);
  return [numerator / divider, denominator / divider];
};

const parseRatio = (ratio) =>
  ratio.split(":").map((value) => parseInt(value, 10));

const AspectRatio = ({ pasted }) => {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [ratio, setRatio] = useState("16:9");
  const [calculated, setCalculated] = useState(RATIO);

  // recognize pasted resolution or ratio
  useEffect(() => {
    const cleaned = pasted.replace(/\*/g, "x").replace(/\s/g, "");
    matchGroups(cleaned, patterns.resolution, ({ width, height }) => {
      setCalculated(RATIO);
      setWidth(parseInt(width, 10));
      setHeight(parseInt(height, 10));
    });
    matchGroups(cleaned, patterns.ratio, ({ width, height }) => {
      setCalculated(WIDTH);
      setRatio(`${width}:${height}`);
    });
  }, [pasted]);

  // recalculate selected field
  if (calculated === WIDTH) {
    const [ratioWidth, ratioHeight] = parseRatio(ratio);
    const newWidth = (height / ratioHeight) * ratioWidth;
    if (newWidth !== width) {
      setWidth(newWidth);
    }
  } else if (calculated === HEIGHT) {
    const [ratioWidth, ratioHeight] = parseRatio(ratio);
    const newHeight = (width / ratioWidth) * ratioHeight;
    if (newHeight !== height) {
      setHeight(newHeight);
    }
  } else if (calculated === RATIO) {
    const [ratioWidth, ratioHeight] = normalizeFraction(width, height);
    const newRatio = `${ratioWidth}:${ratioHeight}`;
    if (newRatio !== ratio) {
      setRatio(newRatio);
    }
  }

  return (
    <Grid>
      <FieldLabel>Width</FieldLabel>
      <NumberField
        state={width}
        setState={setWidth}
        readOnly={calculated === WIDTH}
      />
      <Calculator
        isOn={calculated === WIDTH}
        onClick={() => {
          setCalculated(WIDTH);
        }}
      />

      <FieldLabel>Height</FieldLabel>
      <NumberField
        state={height}
        setState={setHeight}
        readOnly={calculated === HEIGHT}
      />
      <Calculator
        isOn={calculated === HEIGHT}
        onClick={() => {
          setCalculated(HEIGHT);
        }}
      />

      <FieldLabel>Ratio</FieldLabel>
      <RatioField
        state={ratio}
        setState={setRatio}
        readOnly={calculated === RATIO}
      />
      <Calculator
        isOn={calculated === RATIO}
        onClick={() => {
          setCalculated(RATIO);
        }}
      />
    </Grid>
  );
};

export default AspectRatio;
