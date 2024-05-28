import fs from "fs";
import zlib from "zlib";

function getContentFromHash(hash: string): Buffer {
  const directory = hash.substring(0, 2);
  const file = hash.substring(2);
  const blob = fs.readFileSync(`.git/objects/${directory}/${file}`);
  return zlib.unzipSync(blob);
}

export { getContentFromHash };
