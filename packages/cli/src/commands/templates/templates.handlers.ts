import { Command } from "commander";


export class TemplateHandlers {
  constructor() {}

    async getAvailableTemplates() {
        // Logic to fetch available templates
        return [];
    }

    async createProjectFromTemplate(templateName: string, options: TemplateCreateOptions) {
        // Logic to create a project from the specified template
        console.log(`Creating project from template: ${templateName}`);
        console.log(`Options:`, options);
    }

    
}