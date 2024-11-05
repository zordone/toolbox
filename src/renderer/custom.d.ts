// help webpack to resolve image imports
declare module "*.png" {
  const value: string;
  // noinspection JSUnusedGlobalSymbols - webpack does use this
  export default value;
}
