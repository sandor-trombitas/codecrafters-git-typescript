import { init } from "./commands/init";

const args = process.argv.slice(2);
const command = args[0];

enum Commands {
  Init = "init",
  CatFile = "cat-file",
}

switch (command) {
  case Commands.Init:
    init();
    break;
  case Commands.CatFile:
    catFile(args);
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}
