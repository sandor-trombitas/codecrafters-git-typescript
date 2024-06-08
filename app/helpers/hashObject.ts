import fs from "fs";
import crypto from "crypto";
import path from "path";
import { deflateSync } from "zlib";

export interface HashObject {
  hash: string;
  content: Buffer;
  path: string;
  fileName: string;
}

function calculateSha1(data: Buffer): string {
  const shaSum = crypto.createHash("sha1");
  shaSum.update(`blob ${data.length}\0`);
  shaSum.update(data);
  return shaSum.digest("hex");
}

function getHashObject(filePath: string): HashObject {
  const content = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  const hash = calculateSha1(content);

  return {
    hash,
    content,
    path: filePath,
    fileName: filename,
  };
}

function writeHashObject(
  { content, hash }: Pick<HashObject, "content" | "hash">,
  header: string = "blob",
): void {
  const directory = hash.substring(0, 2);
  if (!fs.existsSync(`.git/objects/${directory}`)) {
    fs.mkdirSync(`.git/objects/${directory}`, { recursive: true });
  }
  const filename = hash.substring(2);
  const compressed = deflateSync(`${header} ${content.length}\0${content}`);
  fs.writeFileSync(`.git/objects/${directory}/${filename}`, compressed);
}

export { getHashObject, writeHashObject, calculateSha1 };
