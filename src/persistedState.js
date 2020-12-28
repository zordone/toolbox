import { useState, useEffect } from "react";
import { identity } from "./utils";

const PREFIX = "state";

// useState persisted into local storage
export const usePersistedState = (
  Comp,
  stateKey,
  defaultValue,
  onSerialize = identity,
  onDeserialize = identity
) => {
  if (!Comp?.name) {
    throw new Error("usePersistedState: No component name!");
  }
  if (typeof stateKey !== "string" || !stateKey) {
    throw new Error("usePersistedState: No state key!");
  }
  const key = [PREFIX, Comp.name, stateKey].join("-");
  const [state, setState] = useState(
    () => onDeserialize(JSON.parse(localStorage.getItem(key))) || defaultValue
  );
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(onSerialize(state)));
  }, [key, state, onSerialize]);
  return [state, setState];
};

const setToArray = (set) => Array.from(set);
const arrayToSet = (array) => array && new Set(array);

// useState persisted into local storage - for Set
export const usePersistedStateSet = (Comp, stateKey, defaultValue) =>
  usePersistedState(Comp, stateKey, defaultValue, setToArray, arrayToSet);

// clear all state persisted by a given tool
export const clearPersistedStateFor = (Comp) => {
  const compPrefix = [PREFIX, Comp.name, ""].join("-");
  Object.keys(localStorage)
    .filter((key) => key.startsWith(compPrefix))
    .forEach((key) => {
      localStorage.removeItem(key);
    });
};
