// src/commands/passthrough.commands.ts
import { Command } from 'commander';
import { NEST_COMMANDS } from '../constants/commands.constants';
import { executeNestCommand } from '../utils/nest-cli.utils';

export function registerPassthroughCommands(program: Command): void {
  // Register all standard NestJS CLI commands for passthrough
  NEST_COMMANDS.forEach(command => {
    program
      .command(`${command} [options...]`)
      .description(`NestJS '${command}' command passthrough`)
      .allowUnknownOption()
      .action((options) => {
        const args = [command, ...(Array.isArray(options) ? options : [])];
        executeNestCommand(args.join(' '));
      });
  });
}