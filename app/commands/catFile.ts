import fs from "fs";
import zlib from "zlib";
import { getContentFromHash } from "../helpers/getContentFromHash";

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
  const content = getContentFromHash(hash);

  // The format of a blob object file looks like this (after Zlib decompression):
  // `blob <size>\0<content>`
  // <size> is the size of the content (in bytes)
  // \0 is a null byte
  // <content> is the actual content of the file
  // We want to output the content
  process.stdout.write(content.subarray(content.indexOf(0) + 1).toString());
}

export { catFile };
