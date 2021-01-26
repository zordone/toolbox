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

export const limit = (num, min, max) => Math.min(max, Math.max(num, min));

export const roundTo = (num, fixed) => num && num.toFixed(fixed);

export const displayName = (name, StyledComp) => {
  StyledComp.displayName = name;
  return StyledComp;
};

export const setToolMeta = (toolComp, { name, description, settings = [] }) => {
  toolComp.displayName = name;
  toolComp.meta = {
    name,
    description,
    settings,
  };
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

export const formatJson = (obj) => JSON.stringify(obj, null, 2);

export const stopPropagation = (event) => {
  event.stopPropagation();
};

export const preventDefault = (event) => {
  event.preventDefault();
  event.stopPropagation();
};
