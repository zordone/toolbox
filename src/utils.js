export const noop = () => {};

export const identity = (x) => x;

export const gcd = (a, b) => (b ? gcd(b, a % b) : a);

export const matchGroups = (text, regex, onMatch = noop) => {
  // ex: /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/
  const match = regex.exec(text);
  if (match) {
    onMatch(match.groups);
  }
};

export const patterns = {
  resolution: /(?<width>\d+)x(?<height>\d+)/,
  ratio: /(?<width>\d+):(?<height>\d+)/,
};

export const displayName = (name, StyledComp) => {
  StyledComp.displayName = name;
  return StyledComp;
};

export const capitalize = (text) => `${text[0].toUpperCase()}${text.slice(1)}`;

export const reindent = (code, baseIndent = 0) => {
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