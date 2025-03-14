#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import { CLI_VERSION } from './constants/commands.constants';
import { registerPluginCommands } from './commands/plugin.commands';
import { registerTemplateCommands } from './commands/template.commands';
import { registerPassthroughCommands } from './commands/passthrough.commands';

// Setup CLI program
program
  .name('pnest')
  .description('Extended NestJS CLI with plugin management')
  .version(CLI_VERSION);

// Register all command groups
registerPluginCommands(program);
registerTemplateCommands(program);
registerPassthroughCommands(program);

// Handle unknown commands by passing to NestJS CLI
program.on('command:*', () => {
  const nestCommand = process.argv.slice(2).join(' ');
  console.log(chalk.blue(`Forwarding command to NestJS CLI: ${nestCommand}`));
  require('./utils/nest-cli.utils').executeNestCommand(nestCommand);
});

program.parse(process.argv);
