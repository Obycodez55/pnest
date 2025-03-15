// src/commands/template.commands.ts
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { 
  getAvailableTemplates, 
  createProjectFromTemplate 
} from '../utils/template.utils';
import { TemplateCreateOptions } from '../interfaces/template.interface';

export function registerTemplateCommands(program: Command): void {
  program
    .command('template [template-name]')
    .description('Create a new project from a template')
    .option('-n, --name <project-name>', 'Name of the project')
    .option('-d, --directory <directory>', 'Output directory')
    .option('-sg, --skip-git', 'Initialize a git repository', false)
    .option('-si, --skip-install', 'Skip installing dependencies', false)
    .action(async (templateName, options) => {
      try {
        const templates = await getAvailableTemplates();
        
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
        
        await createProjectFromTemplate(template, projectName, outputDir, createOptions);
        console.log(chalk.green(`Project created successfully in ${outputDir}!`));
        console.log(chalk.cyan('Next steps:'));
        console.log(`  cd ${outputDir}`);
        console.log('  npm run start:dev');
      } catch (error) {
        console.error(chalk.red(`Failed to create project: ${error.message}`));
      }
    });
}