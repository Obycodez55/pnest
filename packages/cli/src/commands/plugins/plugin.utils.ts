import * as path from "path";
import { PluginManifest, PNestPlugin } from "./plugin.interface";
import fs from 'fs-extra';
import chalk from "chalk";
import execa from "execa";
import { NestUtils } from '../nest/nest.utils';

const PLUGIN_REGISTRY_PATH = path.join(__dirname, '../../../plugins');
const PROJECT_CONFIG_PATH = path.join(process.cwd(), 'pnest.json');

export class PluginUtils {
    /**
     * Get all available plugins from the registry
     */
    static async getAvailablePlugins(): Promise<PluginManifest[]> {
        try {
            const pluginDirs = await fs.readdir(PLUGIN_REGISTRY_PATH);

            const plugins: PluginManifest[] = [];
            for (const dir of pluginDirs) {
                const manifestPath = path.join(PLUGIN_REGISTRY_PATH, dir, 'package.json');
                if (await fs.pathExists(manifestPath)) {
                    const packageJson = await fs.readJSON(manifestPath);
                    const manifest = packageJson.pnest as PluginManifest;

                    if (manifest) {
                        plugins.push({
                            ...manifest,
                            name: dir
                        });
                    }
                }
            }
            return plugins;
        } catch (error) {
            console.warn(chalk.yellow('Warning: Could not read plugins directory.'));
            return [];
        }
    }

    /**
     * Get plugins installed in the current project
     */
    static async getInstalledPlugins(): Promise<PluginManifest[]> {
        if (!await fs.pathExists(PROJECT_CONFIG_PATH)) {
            return [];
        }

        try {
            const config = await fs.readJSON(PROJECT_CONFIG_PATH);
            return config.plugins || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Install a plugin into the current project
     */
    static async installPlugin(plugin: PluginManifest, provider: string): Promise<void> {
        // Check if current directory is a NestJS project
        if (!await NestUtils.isNestProject()) {
            throw new Error('Not a NestJS project. Please run this command in a NestJS project directory.');
        }

        // 1. Update pnest.json config
        let config = { plugins: [] };

        if (await fs.pathExists(PROJECT_CONFIG_PATH)) {
            config = await fs.readJson(PROJECT_CONFIG_PATH);
            if (!config.plugins) config.plugins = [];
        }

        // Check if already installed
        const existingPlugin = config.plugins.find(p => p.name === plugin.name);
        if (existingPlugin) {
            throw new Error(`Plugin "${plugin.name}" is already installed.`);
        }

        // Add to config
        config.plugins.push({
            name: plugin.name,
            provider,
            version: plugin.version
        });

        await fs.writeJson(PROJECT_CONFIG_PATH, config, { spaces: 2 });

        // 2. Install plugin package
        console.log(chalk.blue(`Installing @pnest/plugin-${plugin.name}...`));

        try {
            await execa('npm', ['install', `@pnest/plugin-${plugin.name}`], {
                stdio: 'inherit'
            });
        } catch (error) {
            // If package doesn't exist yet (during development), just log a warning
            console.warn(chalk.yellow(`Warning: Could not install @pnest/plugin-${plugin.name} package. It may not exist yet.`));
            console.log(chalk.blue('Continuing with plugin setup...'));
        }

        // 3. Load and run plugin setup
        try {
            const pluginModule = require(`@pnest/plugin-${plugin.name}`);
            const pluginInstance: PNestPlugin = new pluginModule.default();
            await pluginInstance.setup(provider);

            // 4. Update NestJS module imports
            await PluginUtils.updateModuleImports(pluginInstance, provider);
        } catch (error) {
            console.warn(chalk.yellow(`Warning: Could not load plugin module. It may not exist yet.`));
            console.log(chalk.yellow('Plugin was added to configuration but not fully set up.'));
        }
    }

    /**
     * Remove a plugin from the current project
     */
    static async removePlugin(pluginName: string): Promise<void> {
        // 1. Check if plugin is installed
        if (!await fs.pathExists(PROJECT_CONFIG_PATH)) {
            throw new Error('No PNest configuration found.');
        }

        const config = await fs.readJson(PROJECT_CONFIG_PATH);
        if (!config.plugins) {
            throw new Error(`Plugin "${pluginName}" is not installed.`);
        }

        const pluginIndex = config.plugins.findIndex(p => p.name === pluginName);
        if (pluginIndex === -1) {
            throw new Error(`Plugin "${pluginName}" is not installed.`);
        }

        // 2. Load plugin and run cleanup
        try {
            const pluginModule = require(`@pnest/plugin-${pluginName}`);
            const pluginInstance: PNestPlugin = new pluginModule.default();
            await pluginInstance.cleanup();
        } catch (error) {
            console.warn(chalk.yellow(`Warning: Could not load plugin module for cleanup. It may not exist yet.`));
        }

        // 3. Remove from config
        config.plugins.splice(pluginIndex, 1);
        await fs.writeJson(PROJECT_CONFIG_PATH, config, { spaces: 2 });

        // 4. Uninstall plugin package
        console.log(chalk.blue(`Uninstalling @pnest/plugin-${pluginName}...`));

        try {
            await execa('npm', ['uninstall', `@pnest/plugin-${pluginName}`], {
                stdio: 'inherit'
            });
        } catch (error) {
            console.warn(chalk.yellow(`Warning: Could not uninstall @pnest/plugin-${pluginName} package.`));
        }
    }



    /**
     * Update application module imports to include the plugin
     */
    static async updateModuleImports(plugin: PNestPlugin, provider: string): Promise<void> {
        try {
            // Get module import code
            const moduleImport = plugin.getModuleImport(provider);

            // In a real implementation, this would modify the app.module.ts file
            // For now, we'll just log what would happen
            console.log(chalk.blue(`Plugin module import would be added to app.module.ts:`));
            console.log(moduleImport);

            // Future: Implement actual app.module.ts modification
            // 1. Find app.module.ts file 
            // 2. Parse the file with typescript parser
            // 3. Add import statement
            // 4. Add to imports array
            // 5. Write back to file
        } catch (error) {
            console.warn(chalk.yellow(`Warning: Could not generate module import for ${plugin.name}.`));
        }

    }
}