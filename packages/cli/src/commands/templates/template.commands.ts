import { Command } from "commander";
import { TemplateHandlers } from "./template.handlers";


export class TemplateCommand{
    private readonly program: Command;
    constructor(
        program: Command,
        private readonly templateHandlers: TemplateHandlers
    ) {
        this.program = program.command("template")
            .description("Manage PNest templates");
    }

    registerCommands(): void {
        this.program
            .argument("template-name")
            .description("Create a new project from a template")
            .option("-n, --name <project-name>", "Name of the project")
            .option("-d, --directory <directory>", "Output directory")
            .option("-sg, --skip-git", "Initialize a git repository", false)
            .option("-si, --skip-install", "Skip installing dependencies", false)
            .action(this.templateHandlers.createProjectFromTemplate);

        this.program
            .command("list")
            .description("List available templates")
            .action(this.templateHandlers.getAvailableTemplates);
    }
}