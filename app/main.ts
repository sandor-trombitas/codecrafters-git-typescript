import { init } from "./commands/init";
import { catFile } from "./commands/catFile";
import { hashObject } from "./commands/hashObject";
import { lsTree } from "./commands/lsTree";
import { writeTree } from "./commands/writeTree";

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
  Init = "init",
  CatFile = "cat-file",
  HashObject = "hash-object",
  LsTree = "ls-tree",
  WriteTree = "write-tree",
}

switch (command) {
  case Commands.Init:
    init();
    break;
  case Commands.CatFile:
    catFile(args);
    break;
  case Commands.HashObject:
    hashObject(args);
    break;
  case Commands.LsTree:
    lsTree(args);
    break;
  case Commands.WriteTree:
    console.log(writeTree(process.cwd()));
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}
