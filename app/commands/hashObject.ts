import { getHashObject, writeHashObject } from "../helpers/hashObject";

function hashObject(args: Array<string>): void {
  let file = args.at(-1);
  let params: Array<string> = [];
  if (!file) {
    throw new Error("fatal: pathspec not found");
  }
  if (args.length > 2) {
    params = args.slice(1, -1);
  }

  const hashObject = getHashObject(file);

  if (params.includes("-w")) {
    writeHashObject(hashObject);
  }
  console.log(hashObject.hash);
}

export { hashObject };
