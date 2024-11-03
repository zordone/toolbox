import React, { FC, MouseEventHandler, useEffect } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import Button from "../common/Buttons";
import Icon from "../common/Icon";
import { FieldLabel, IntegerField, RatioField } from "../fields";
import { usePersistedState } from "../persistedState";
import { registerTool, ToolProps } from "../toolStore";
import { displayName, gcd, matchGroups } from "../utils";

const WIDTH = "width";
const HEIGHT = "height";
const RATIO = "ratio";

const reResolution = /(?<width>\d+)x(?<height>\d+)/;
const reRatio = /(?<width>\d+):(?<height>\d+)/;

const Grid = displayName(
  "Grid",
  styled.div`
    display: grid;
    grid-template-columns: 0fr 10rem 0fr;
    gap: var(--gap-size);
  `,
);

interface CalculatorProps {
  isOn: boolean;
  onClick: MouseEventHandler;
}

const Calculator: FC<CalculatorProps> = ({ isOn, onClick }) => {
  return (
    <Button
      {...{ isOn, onClick }}
      title="Set this field to be the calculated one"
    >
      <Icon name="fa-calculator" />
    </Button>
  );
};

const normalizeFraction = (numerator: number, denominator: number) => {
  const divider = gcd(numerator, denominator);
  return [numerator / divider, denominator / divider];
};

const parseRatio = (ratio: string) =>
  ratio.split(":").map((value) => parseInt(value, 10));

const AspectRatio: FC<ToolProps> = ({ pasted }) => {
  const [width, setWidth] = usePersistedState(AspectRatio, "width", 1920);
  const [height, setHeight] = usePersistedState(AspectRatio, "height", 1080);
  const [ratio, setRatio] = usePersistedState(AspectRatio, "ratio", "16:9");
  const [calc, setCalc] = usePersistedState(AspectRatio, "calc", RATIO);

  // recognize pasted resolution or ratio
  useEffect(() => {
    const cleaned = (pasted ?? "").replace(/\*/g, "x").replace(/\s/g, "");
    matchGroups(cleaned, reResolution, ({ width, height }) => {
      setCalc(RATIO);
      setWidth(parseInt(width, 10));
      setHeight(parseInt(height, 10));
      toast.success("Pasted width & height.");
    });
    matchGroups(cleaned, reRatio, ({ width, height }) => {
      setCalc(WIDTH);
      setRatio(`${width}:${height}`);
      toast.success("Pasted aspect ratio.");
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
      <IntegerField
        readOnly={calc === WIDTH}
        setState={setWidth}
        state={width}
      />
      <Calculator
        isOn={calc === WIDTH}
        onClick={() => {
          setCalc(WIDTH);
        }}
      />

      <FieldLabel>Height</FieldLabel>
      <IntegerField
        readOnly={calc === HEIGHT}
        setState={setHeight}
        state={height}
      />
      <Calculator
        isOn={calc === HEIGHT}
        onClick={() => {
          setCalc(HEIGHT);
        }}
      />

      <FieldLabel>Ratio</FieldLabel>
      <RatioField readOnly={calc === RATIO} setState={setRatio} state={ratio} />
      <Calculator
        isOn={calc === RATIO}
        onClick={() => {
          setCalc(RATIO);
        }}
      />
    </Grid>
  );
};

registerTool({
  component: AspectRatio,
  name: "AspectRatio",
  description: "Aspect ratio calculator.",
});
