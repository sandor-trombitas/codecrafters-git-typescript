import { getContentFromHash } from "../helpers/getContentFromHash";

type TreeEntry = {
  type: string;
  mode: string;
  hash: string;
  name: string;
};

function lsTree(args: Array<string>): void {
  let params: Array<string> = [];
  const hash = args.at(-1);

  if (!hash) {
    throw new Error("fatal: pathspec not found");
  }

  if (args.length > 2) {
    params = args.slice(1, -1);
  }
  let treeEntries: Array<TreeEntry> = [];
  const content = getContentFromHash(hash);
  const body = content.subarray(content.indexOf("\0") + 1);
  let nullIndex = 0;
  for (let i = 0; i < body.length; i = nullIndex + 21) {
    const spaceIndex = body.indexOf(" ", i);
    nullIndex = body.indexOf("\0", spaceIndex);

    const mode = body.subarray(i, spaceIndex).toString();
    const name = body.subarray(spaceIndex, nullIndex).toString();
    const hash = body.subarray(nullIndex + 1, nullIndex + 21).toString("hex");
    const type = mode === "40000" ? "tree" : "blob";

    treeEntries.push({ type, mode, hash, name });
  }

  for (const entry of treeEntries) {
    console.log(`${entry.mode} ${entry.type} ${entry.hash} ${entry.name}`);
  }
}

export { lsTree };
