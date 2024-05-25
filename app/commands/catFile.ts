import fs from "fs";
import zlib from "zlib";

function catFile(args: Array<string>): void {
  const params = args.at(1);
  const hash = args.at(2);
  if (params?.indexOf("-p") !== 0) {
    throw new Error(
      "fatal: only two arguments allowed in <type> <object> mode, not 1",
    );
  }
  if (!hash) {
    throw new Error(`fatal: <object> required with ${params}`);
  }
  const directory = hash.substring(0, 2);
  const file = hash.substring(2);
  const blob = fs.readFileSync(`.git/objects/${directory}/${file}`);
  const decompressedBuffer = zlib.unzipSync(blob);

  // The format of a blob object file looks like this (after Zlib decompression):
  // `blob <size>\0<content>`
  // <size> is the size of the content (in bytes)
  // \0 is a null byte
  // <content> is the actual content of the file
  // We want to output the content
  process.stdout.write(
    decompressedBuffer.subarray(decompressedBuffer.indexOf(0) + 1).toString(),
  );
}

export { catFile };
