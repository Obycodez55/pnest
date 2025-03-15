#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import { CLI_VERSION } from './constants/commands.constants';
import { registerCommands } from './register';

// Setup CLI program
program
  .name('pnest')
  .description('Extended NestJS CLI with plugin management')
  .version(CLI_VERSION);

registerCommands(program);

// Handle unknown commands by passing to NestJS CLI
program.on('command:*', () => {
  const nestCommand = process.argv.slice(2).join(' ');
  console.log(chalk.blue(`Forwarding command to NestJS CLI: ${nestCommand}`));
  require('./utils/nest-cli.utils').executeNestCommand(nestCommand);
});

program.parse(process.argv);
