import chalk from 'chalk';
import { PluginUtils } from './plugin.utils';
import { Command } from 'commander';
import { ListPluginsOptions } from './plugin.interface';

export class PluginHandlers {
    constructor(private readonly program: Command) { }

    async listPlugins(options: ListPluginsOptions) {
        if (options.installed) {
            const installedPlugins = await PluginUtils.getInstalledPlugins();
            console.log(chalk.green('Installed plugins:'));
            installedPlugins.forEach(plugin => {
                console.log(`  - ${chalk.cyan(plugin.name)} (${plugin.version}): ${plugin.description}`);
            });
        } else {
            const availablePlugins = await PluginUtils.getAvailablePlugins();
            console.log(chalk.green('Available plugins:'));
            availablePlugins.forEach(plugin => {
                console.log(`  - ${chalk.cyan(plugin.name)}: ${plugin.description}`);
            });
        }
    }


    async installPlugin(pluginName: string, provider: string) {
        // Logic to install the specified plugin
        console.log(`Installing plugin: ${pluginName}`);
        console.log(`Provider: ${provider}`);
    }
}