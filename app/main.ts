import * as fs from "fs";
import zlib from "zlib";

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
  Init = "init",
  CatFile = "cat-file",
}

const catFile = (args: Array<string>) => {
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
  // We want to output the content
  process.stdout.write(
    decompressedBuffer.subarray(decompressedBuffer.indexOf(0) + 1).toString(),
  );
};

switch (command) {
  case Commands.Init:
    // You can use print statements as follows for debugging, they'll be visible when running tests.
    console.log("Logs from your program will appear here!");

    // Uncomment this block to pass the first stage
    fs.mkdirSync(".git", { recursive: true });
    fs.mkdirSync(".git/objects", { recursive: true });
    fs.mkdirSync(".git/refs", { recursive: true });
    fs.writeFileSync(".git/HEAD", "ref: refs/heads/main\n");
    console.log("Initialized git directory");
    break;
  case Commands.CatFile:
    catFile(args);
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}
