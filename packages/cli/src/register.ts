import { Command } from "commander";
import { registerTemplateCommands } from "./commands/template.commands";
import { registerPassthroughCommands } from "./commands/passthrough.commands";
import { PluginCommands } from "./commands/plugins/plugin.commands";
import { PluginHandlers } from "./commands/plugins/plugins.handlers";


export function registerCommands(program: Command){
    // Register plugin commands
    const pluginHandler = new PluginHandlers()
    new PluginCommands(program, pluginHandler).register();
    
    // Register template commands
    registerTemplateCommands(program);
    
    // Register passthrough commands
    registerPassthroughCommands(program);
}