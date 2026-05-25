import { gcd, limit, capitalize, repeat, reindent } from "./utils";

describe("gcd", () => {
  it("returns the greater number when one is zero", () => {
    expect(gcd(12, 0)).toBe(12);
  });
  it("computes correctly", () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(100, 75)).toBe(25);
  });
});

describe("limit", () => {
  it("clamps to min", () => {
    expect(limit(1, 5, 10)).toBe(5);
  });
  it("clamps to max", () => {
    expect(limit(15, 5, 10)).toBe(10);
  });
  it("passes through values in range", () => {
    expect(limit(7, 5, 10)).toBe(7);
  });
});

describe("capitalize", () => {
  it("uppercases the first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });
  it("leaves the rest unchanged", () => {
    expect(capitalize("hELLO")).toBe("HELLO");
  });
});

describe("repeat", () => {
  it("repeats without separator", () => {
    expect(repeat("foo", 3)).toBe("foofoofoo");
  });
  it("repeats with separator", () => {
    expect(repeat("foo", 2, "_")).toBe("foo_foo");
  });
  it("doesn't repeat by default", () => {
    expect(repeat("foo")).toBe("foo");
  });
});

describe("reindent", () => {
  const code = `
      for (let i = 0; i < 10; i++) {
        console.log(i);
      }
    `;

  it("reindents to no indentation", () => {
    const lines = reindent(code).split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("for (let i = 0; i < 10; i++) {");
    expect(lines[1]).toBe("  console.log(i);");
    expect(lines[2]).toBe("}");
  });
  it("reindents to base indentation", () => {
    const lines = reindent(code, 2).split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("  for (let i = 0; i < 10; i++) {");
    expect(lines[1]).toBe("    console.log(i);");
    expect(lines[2]).toBe("  }");
  });
  it("removes blanks and trailing spaces", () => {
    const lines = reindent(`\n  \n${code}  `).split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("for (let i = 0; i < 10; i++) {");
    expect(lines[1]).toBe("  console.log(i);");
    expect(lines[2]).toBe("}");
  });
});
