import fs from "fs";
import path from "path";
import {
  calculateSha1,
  getHashObject,
  writeHashObject,
} from "../helpers/hashObject";

type TreeEntry = {
  mode?: string;
  name?: string;
  sha?: Buffer;
  subPath?: string;
};

function writeTree(workingDirectoryPath: string): string {
  const readDir = fs.readdirSync(workingDirectoryPath);

  const files: Map<string, Buffer> = new Map();
  const dirs: Map<string, TreeEntry> = new Map();
  let contentBuffer = Buffer.alloc(0);

  readDir.forEach((entry) => {
    if (entry === ".git") return;
    const subPath = path.join(workingDirectoryPath, entry);
    const entryStats = fs.statSync(path.join(workingDirectoryPath, entry));
    if (entryStats.isFile()) {
      const fileHashObject = getHashObject(subPath);
      writeHashObject(fileHashObject);

      const modeBuffer = Buffer.from(entryStats.mode + " ");
      const nameBuffer = Buffer.from(entry);
      const nullBuffer = Buffer.from([0]);
      const shaBuffer = Buffer.from(fileHashObject.hash, "hex");
      const fileBuffer = Buffer.concat([
        modeBuffer,
        nameBuffer,
        nullBuffer,
        shaBuffer,
      ]);
      contentBuffer = Buffer.concat([contentBuffer, fileBuffer]);

      return;
    }

    const dirSha = writeTree(subPath);
    const modeBuffer = Buffer.from("4000 ");
    const nameBuffer = Buffer.from(entry);
    const nullBuffer = Buffer.from([0]);
    const shaBuffer = Buffer.from(dirSha, "hex");
    const dirBuffer = Buffer.concat([
      modeBuffer,
      nameBuffer,
      nullBuffer,
      shaBuffer,
    ]);

    contentBuffer = Buffer.concat([contentBuffer, dirBuffer]);
  });

  const sha = calculateSha1(contentBuffer);
  writeHashObject({ content: contentBuffer, hash: sha }, "tree");

  return sha;
}

export { writeTree };
