declare module "*.png" {
  const value: string;
  export default value;
}

// there is no type package for this one
declare module "safer-eval" {
  export default function saferEval(code: string, context: object);
}

// temporary fix to convice TS that randomUUID exists
interface Crypto {
  randomUUID(): string;
}
