import { NamedExoticComponent, SyntheticEvent } from "react";

export const noop = () => {
  // comment to satisfy eslint
};

export const identity = <T>(x: T): T => x;

export const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

interface MatchGroups {
  [key: string]: string;
}

type OnMatch = (groups: MatchGroups) => void;

export const matchGroups = (
  text: string,
  regex: RegExp,
  onMatch: OnMatch = noop
): void => {
  // ex: /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/
  const match = regex.exec(text);
  if (match) {
    onMatch(match.groups);
  }
};

export const limit = (num: number, min: number, max: number): number =>
  Math.min(max, Math.max(num, min));

export const roundTo = (num: number, fixed: number): string =>
  num && num.toFixed(fixed);

export const displayName = <TComp extends NamedExoticComponent>(
  name: string,
  StyledComp: TComp
): TComp => {
  StyledComp.displayName = name;
  return StyledComp;
};

export const capitalize = (text: string) =>
  `${text[0].toUpperCase()}${text.slice(1)}`;

export const repeat = (text: string, times = 1, separator = "") =>
  Array(times).fill(text).join(separator);

export const reindent = (code: string, baseIndent = 0) => {
  const trimmed = code
    .replace(/^[\s\n\r]+$/gm, "\n") // trim blanks
    .replace(/^\n*/, "") // remove leading blanks
    .replace(/\n*$/, ""); // remove trailing blanks
  // remove original base indent
  const oldIndent = Array(trimmed.match(/^ */)[0].length).fill(" ").join("");
  const dedented = trimmed.replace(new RegExp("^" + oldIndent, "gm"), "");
  // add new base indent
  const newIndent = Array(baseIndent).fill(" ").join("");
  const reindented = dedented.replace(/^/gm, newIndent);
  return reindented;
};

export const escapeHtml = (unsafe: string) =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const formatJson = (obj: unknown) => JSON.stringify(obj, null, 2);

export const stopPropagation = (event: SyntheticEvent) => {
  event.stopPropagation();
};

export const preventDefault = (event: SyntheticEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

// convert html encoded text to plain text
const converter = document.createElement("textarea");
export const htmlToText = (html: string) => {
  converter.innerHTML = html;
  return converter.value;
};
