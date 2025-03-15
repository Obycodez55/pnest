import { Command } from 'commander';
import { PluginHandlers } from './plugins.handlers';

export class PluginCommands {
    private readonly program: Command;
    private pluginHandler: PluginHandlers;
    constructor(program: Command, pluginHandler: PluginHandlers) {
        this.program = program.command('plugin')
            .description('Manage PNest plugins');
    }

    register() {

        // List command
        this.program
            .command('list')
            .description('List available plugins')
            .option('-i, --installed', 'Show only installed plugins')
            .action(this.pluginHandler.listPlugins);

        // Add command
        this.program
            .command('add <plugin>')
            .description('Add a plugin to your project')
            .option('-p, --provider <provider>', 'Specify provider to use')
            .action(this.pluginHandler.addPlugin);

        // Remove command
        this.program
            .command('remove <plugin>')
            .description('Remove a plugin from your project')
            .action(this.pluginHandler.removePlugin);
    }
}