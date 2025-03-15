import { Command } from "commander";
import { NestHandlers } from "./nest.handlers";
import { NEST_COMMANDS } from "../../constants/commands.constants";


export class NestCommand {

    constructor(private readonly program: Command, private readonly nestHandler: NestHandlers) {}

    register() {
        // Register passthrough command
       NEST_COMMANDS.forEach(command => {
           this.program
             .command(`${command} [options...]`)
             .description(`NestJS '${command}' command passthrough`)
             .allowUnknownOption()
             .action(this.nestHandler.handlePasssthroughCommand);
         });
    }
}