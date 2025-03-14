// src/commands/plugin.commands.ts
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { 
  getAvailablePlugins, 
  installPlugin, 
  removePlugin, 
  getInstalledPlugins 
} from '../utils/plugin.utils';

export function registerPluginCommands(program: Command): Command {
  const pluginCommand = program.command('plugin')
    .description('Manage PNest plugins');

  // List command
  pluginCommand
    .command('list')
    .description('List available plugins')
    .option('-i, --installed', 'Show only installed plugins')
    .action(async (options) => {
      if (options.installed) {
        const installedPlugins = await getInstalledPlugins();
        console.log(chalk.green('Installed plugins:'));
        installedPlugins.forEach(plugin => {
          console.log(`  - ${chalk.cyan(plugin.name)} (${plugin.version}): ${plugin.description}`);
        });
      } else {
        const availablePlugins = await getAvailablePlugins();
        console.log(chalk.green('Available plugins:'));
        availablePlugins.forEach(plugin => {
          console.log(`  - ${chalk.cyan(plugin.name)}: ${plugin.description}`);
        });
      }
    });

  // Add command
  pluginCommand
    .command('add <plugin>')
    .description('Add a plugin to your project')
    .option('-p, --provider <provider>', 'Specify provider to use')
    .action(async (pluginName, options) => {
      try {
        const availablePlugins = await getAvailablePlugins();
        const pluginToInstall = availablePlugins.find(p => p.name === pluginName);
        
        if (!pluginToInstall) {
          console.error(chalk.red(`Plugin "${pluginName}" not found.`));
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
          console.error(chalk.red(`No providers available for plugin "${pluginName}".`));
          return;
        }
        
        await installPlugin(pluginToInstall, provider);
        console.log(chalk.green(`Plugin "${pluginName}" with provider "${provider}" installed successfully!`));
      } catch (error) {
        console.error(chalk.red(`Failed to install plugin: ${error.message}`));
      }
    });

  // Remove command
  pluginCommand
    .command('remove <plugin>')
    .description('Remove a plugin from your project')
    .action(async (pluginName) => {
      try {
        await removePlugin(pluginName);
        console.log(chalk.green(`Plugin "${pluginName}" removed successfully!`));
      } catch (error) {
        console.error(chalk.red(`Failed to remove plugin: ${error.message}`));
      }
    });

  return pluginCommand;
}