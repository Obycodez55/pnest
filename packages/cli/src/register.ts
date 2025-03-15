import { Command } from "commander";
import { registerPluginCommands } from "./commands/plugin.commands";
import { registerTemplateCommands } from "./commands/template.commands";
import { registerPassthroughCommands } from "./commands/passthrough.commands";


export function registerCommands(program: Command){
    // Register plugin commands
    registerPluginCommands(program);
    
    // Register template commands
    registerTemplateCommands(program);
    
    // Register passthrough commands
    registerPassthroughCommands(program);
}