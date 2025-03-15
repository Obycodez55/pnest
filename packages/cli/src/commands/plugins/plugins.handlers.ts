import chalk from 'chalk';
import { PluginUtils } from './plugin.utils';
import { AddPluginOptions, ListPluginsOptions } from './plugin.interface';
import { logger } from '../../utils/logger';
import inquirer from 'inquirer';

export class PluginHandlers {
    constructor() { }

    async listPlugins(options: ListPluginsOptions) {
        if (options.installed) {
            const spinner = logger.spinner("Fetching installed plugins...");
            const installedPlugins = await PluginUtils.getInstalledPlugins();
            spinner.stop();
            if (installedPlugins.length === 0) {
                logger.info("No plugins installed.");
                return;
            }
            logger.section("Installed plugins:");
            installedPlugins.forEach(plugin => {
                logger.listItem(
                    `${chalk.cyan(plugin.name)} (${plugin.version}): ${plugin.description}`,
                )
            }
            );
        } else {
            const spinner = logger.spinner("Fetching available plugins...");
            const availablePlugins = await PluginUtils.getAvailablePlugins();
            spinner.stop();
            if (availablePlugins.length === 0) {
                logger.info("No plugins installed.");
                return;
            }
            logger.section("Installed plugins:");
            availablePlugins.forEach(plugin => {
                logger.listItem(
                    `${chalk.cyan(plugin.name)} (${plugin.version}): ${plugin.description}`,
                )
            }
            );
        }
    }


    async addPlugin(pluginName: string, options: AddPluginOptions) {
        try {
            const availablePlugins = await PluginUtils.getAvailablePlugins();
            const pluginToInstall = availablePlugins.find(p => p.name === pluginName);

            if (!pluginToInstall) {
                logger.error(`Plugin "${pluginName}" not found.`)
                return;
            }

            let provider = options.provider;

            // If provider not specified, prompt user if multiple providers exist
            if (!provider && pluginToInstall.providers.length > 1) {
                const response = await inquirer.prompt([{
                    type: 'list',
                    name: 'provider',
                    message: 'Select a provider:',
                    choices: pluginToInstall.providers.map(p => ({
                        name: `${p.name} - ${p.description}`,
                        value: p.name,
                        short: p.name
                    }))
                }]);
                provider = response.provider;
            } else if (!provider && pluginToInstall.providers.length > 0) {
                // Use default provider if only one exists
                provider = pluginToInstall.providers[0].name;
            } else if (!provider) {
                logger.error(`No providers available for plugin "${pluginName}".`)
                return;
            }

            await PluginUtils.installPlugin(pluginToInstall, provider);
            logger.success(`Plugin "${pluginName}" with provider "${provider}" installed successfully!`)
        } catch (error) {
            logger.error(`Failed to install plugin: ${error.message}`)
        }
    }

    async removePlugin(pluginName: string) {
        try {
            await PluginUtils.removePlugin(pluginName);
            console.log(chalk.green(`Plugin "${pluginName}" removed successfully!`));
        } catch (error) {
            console.error(chalk.red(`Failed to remove plugin: ${error.message}`));
        }
    }
}