import { Command } from "commander";
import { PluginCommands } from "./commands/plugins/plugin.commands";
import { PluginHandlers } from "./commands/plugins/plugins.handlers";
import { NestHandlers } from "./commands/nest/nest.handlers";
import { NestCommand } from "./commands/nest/nest.commands";
import { TemplateHandlers } from "./commands/templates/template.handlers";
import { TemplateCommand } from "./commands/templates/template.commands";


export function registerCommands(program: Command){
    // Register plugin commands
    const pluginHandler = new PluginHandlers()
    new PluginCommands(program, pluginHandler).register();
    
    // Register template commands
    const templateHandler = new TemplateHandlers();
    new TemplateCommand(program, templateHandler).registerCommands();
    
    // Register passthrough commands
    const nestHandler = new NestHandlers();
    new NestCommand(program, nestHandler).register();
}