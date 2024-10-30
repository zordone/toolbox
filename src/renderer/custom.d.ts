declare module "*.png" {
  const value: string;
  export default value;
}

// temporary fix to convince TS that randomUUID exists
interface Crypto {
  randomUUID(): string;
}
