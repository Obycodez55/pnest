import { Command } from "commander";
import { registerTemplateCommands } from "./commands/template.commands";
import { PluginCommands } from "./commands/plugins/plugin.commands";
import { PluginHandlers } from "./commands/plugins/plugins.handlers";
import { NestHandlers } from "./commands/nest/nest.handlers";
import { NestCommand } from "./commands/nest/nest.commands";


export function registerCommands(program: Command){
    // Register plugin commands
    const pluginHandler = new PluginHandlers()
    new PluginCommands(program, pluginHandler).register();
    
    // Register template commands
    registerTemplateCommands(program);
    
    // Register passthrough commands
    const nestHandler = new NestHandlers();
    new NestCommand(program, nestHandler).register();
}