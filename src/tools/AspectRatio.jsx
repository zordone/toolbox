import React, { useEffect } from "react";
import styled from "styled-components";
import { NumberField, RatioField, FieldLabel } from "../components/Fields";
import Button from "../components/Buttons";
import Icon from "../components/Icon";
import { patterns, matchGroups, gcd, displayName } from "../utils";
import { usePersistedState } from "../persistedState";

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
  const [width, setWidth] = usePersistedState(AspectRatio, "width", 1920);
  const [height, setHeight] = usePersistedState(AspectRatio, "height", 1080);
  const [ratio, setRatio] = usePersistedState(AspectRatio, "ratio", "16:9");
  const [calc, setCalc] = usePersistedState(AspectRatio, "calc", RATIO);

  // recognize pasted resolution or ratio
  useEffect(() => {
    const cleaned = pasted?.replace(/\*/g, "x").replace(/\s/g, "");
    matchGroups(cleaned, patterns.resolution, ({ width, height }) => {
      setCalc(RATIO);
      setWidth(parseInt(width, 10));
      setHeight(parseInt(height, 10));
    });
    matchGroups(cleaned, patterns.ratio, ({ width, height }) => {
      setCalc(WIDTH);
      setRatio(`${width}:${height}`);
    });
  }, [pasted, setCalc, setHeight, setRatio, setWidth]);

  // recalculate selected field
  if (calc === WIDTH) {
    const [ratioWidth, ratioHeight] = parseRatio(ratio);
    const newWidth = (height / ratioHeight) * ratioWidth;
    if (newWidth !== width) {
      setWidth(newWidth);
    }
  } else if (calc === HEIGHT) {
    const [ratioWidth, ratioHeight] = parseRatio(ratio);
    const newHeight = (width / ratioWidth) * ratioHeight;
    if (newHeight !== height) {
      setHeight(newHeight);
    }
  } else if (calc === RATIO) {
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
        readOnly={calc === WIDTH}
      />
      <Calculator
        isOn={calc === WIDTH}
        onClick={() => {
          setCalc(WIDTH);
        }}
      />

      <FieldLabel>Height</FieldLabel>
      <NumberField
        state={height}
        setState={setHeight}
        readOnly={calc === HEIGHT}
      />
      <Calculator
        isOn={calc === HEIGHT}
        onClick={() => {
          setCalc(HEIGHT);
        }}
      />

      <FieldLabel>Ratio</FieldLabel>
      <RatioField state={ratio} setState={setRatio} readOnly={calc === RATIO} />
      <Calculator
        isOn={calc === RATIO}
        onClick={() => {
          setCalc(RATIO);
        }}
      />
    </Grid>
  );
};

AspectRatio.displayName = "AspectRatio";

export default AspectRatio;
