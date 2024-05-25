import fs from "fs";
import zlib from "zlib";
import crypto from "crypto";

function hashObject(args: Array<string>): void {
  let file = args.at(-1);
  let params: Array<string> = [];
  if (!file) {
    throw new Error("fatal: pathspec not found");
  }
  if (args.length > 2) {
    params = args.slice(1, -1);
  }
  const content = fs.readFileSync(file);
  const shaSum = crypto.createHash("sha1");
  shaSum.update(`blob ${content.length}\0`);
  shaSum.update(content);
  const hash = shaSum.digest("hex");

  if (params.includes("-w")) {
    const directory = hash.substring(0, 2);
    if (!fs.existsSync(`.git/objects/${directory}`)) {
      fs.mkdirSync(`.git/objects/${directory}`, { recursive: true });
    }
    const filename = hash.substring(2);
    const compressed = zlib.deflateSync(`blob ${content.length}\0${content}`);
    fs.writeFileSync(`.git/objects/${directory}/${filename}`, compressed);
  }
  console.log(hash);
}

export { hashObject };
