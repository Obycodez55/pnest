import { Command } from "commander";
import { ProjectCreateOptions, TemplateCreateOptions } from "./template.interface";
import inquirer from 'inquirer';
import { TemplateUtils } from './template.utils';
import chalk from "chalk";
import { logger } from "../../utils/logger";


export class TemplateHandlers {
    constructor() { }

    async getAvailableTemplates(): Promise<void> {
        // Logic to fetch available templates
        // Get the list of templates
        const spinner = logger.spinner('Fetching available templates...');
        const templates = await TemplateUtils.getAvailableTemplates();
        spinner.succeed();
        // Display the templates
        logger.section('Available Templates');
        templates.forEach(template => {
            logger.listItem(`- ${chalk.cyan(template.name)}: ${template.description}`);
        });

        // Give example of how to use the template
        logger.section('Example Usage');
        logger.listItem(`pnest template ${chalk.cyan('<template-name> -n <project-name> -d <directory>')}`);
    }

    async createProjectFromTemplate(templateName: string, options: ProjectCreateOptions) {
        try {
            const templates = await TemplateUtils.getAvailableTemplates();

            // If no template specified, show list
            if (!templateName) {
                console.log(chalk.green('Available templates:'));
                templates.forEach(template => {
                    console.log(`  - ${chalk.cyan(template.name)}: ${template.description}`);
                });

                const response = await inquirer.prompt([{
                    type: 'list',
                    name: 'template',
                    message: 'Select a template:',
                    choices: templates.map(t => ({
                        name: `${t.name} - ${t.description}`,
                        value: t.name,
                        short: t.name
                    }))
                }]);

                templateName = response.template;
            }

            const template = templates.find(t => t.name === templateName);
            if (!template) {
                console.error(chalk.red(`Template "${templateName}" not found.`));
                return;
            }

            // Get project name if not provided
            let projectName = options.name;
            if (!projectName) {
                const response = await inquirer.prompt([{
                    type: 'input',
                    name: 'name',
                    message: 'Project name:',
                    default: 'my-nest-app'
                }]);
                projectName = response.name;
            }

            // Get options
            let createOptions: TemplateCreateOptions = {
                skipGit: options.skipGit,
                skipInstall: options.skipInstall
            };
            // Get output directory if not provided
            let outputDir = options.directory || projectName;

            await TemplateUtils.createProjectFromTemplate(template, projectName, outputDir, createOptions);
            console.log(chalk.green(`Project created successfully in ${outputDir}!`));
            console.log(chalk.cyan('Next steps:'));
            console.log(`  cd ${outputDir}`);
            console.log('  npm run start:dev');
        } catch (error) {
            console.error(chalk.red(`Failed to create project: ${error.message}`));
        }
    }


}