import * as path from "path";
import { Template, TemplateCreateOptions } from "./template.interface";
import fs from 'fs-extra';
import chalk from "chalk";
import execa from "execa";
import { EXCLUDE_PATTERNS } from "../../constants/template.constants";

export class TemplateUtils {
    private static TEMPLATES_PATH = path.join(__dirname, '../../../../templates');

    /**
 * Get all available templates
 */
    static async getAvailableTemplates(): Promise<Template[]> {
        try {
            const templateDirs = await fs.readdir(TemplateUtils.TEMPLATES_PATH);

            const templates: Template[] = [];

            for (const dir of templateDirs) {
                const metadataPath = path.join(TemplateUtils.TEMPLATES_PATH, dir, 'metadata.json');

                if (await fs.pathExists(metadataPath)) {
                    const metadata = await fs.readJson(metadataPath);
                    templates.push({
                        ...metadata,
                        name: dir
                    });
                }
            }

            return templates;
        } catch (error) {
            console.warn(chalk.yellow('Warning: Could not read templates directory.'));
            return [];
        }
    }

    /**
* Create a new project from a template
*/
    static async createProjectFromTemplate(
        template: Template,
        projectName: string,
        outputDir: string,
        options: TemplateCreateOptions
    ): Promise<void> {
        // 1. Check if output directory already exists
        if (await fs.pathExists(outputDir)) {
            const stats = await fs.stat(outputDir);
            if (stats.isDirectory()) {
                const files = await fs.readdir(outputDir);
                if (files.length > 0) {
                    throw new Error(`Directory ${outputDir} already exists and is not empty.`);
                }
            } else {
                throw new Error(`${outputDir} already exists but is not a directory.`);
            }
        }

        const templateDir = path.join(TemplateUtils.TEMPLATES_PATH, template.name, 'template');

        // Check if template directory exists
        if (!await fs.pathExists(templateDir)) {
            throw new Error(`Template directory for ${template.name} not found.`);
        }

        console.log(chalk.blue(`Creating new project from ${template.name} template...`));

        // 2. Create output directory
        await fs.ensureDir(outputDir);

        // 3. Copy template files
        await TemplateUtils.copyTemplateFiles(templateDir, outputDir);

        // 4. Process template files (replace placeholders)
        console.log(chalk.blue('Processing template files...'));

        await TemplateUtils.processTemplateFiles(outputDir, {
            projectName,
            projectDescription: `A NestJS project generated from the ${template.name} template`,
            // Add more variables as needed
        });



        try {
            if (!options.skipGit) {
                // 5. Install dependencies
                console.log(chalk.blue('Installing dependencies...'));
                await execa('npm', ['install'], {
                    cwd: outputDir,
                    stdio: 'inherit'
                });
            }
            // 6. Initialize git repository if requested
            if (!options.skipInstall) {
                await execa('git', ['init'], {
                    cwd: outputDir,
                    stdio: 'inherit'
                });
            }
        } catch (error) {
            throw new Error(`Failed to install dependencies: ${error.message}`);
        }
    }

    /**
* Process template files to replace placeholders
*/
    private static async processTemplateFiles(
        directory: string,
        variables: Record<string, string>
    ): Promise<void> {
        const files = await fs.readdir(directory);

        for (const file of files) {
            if(EXCLUDE_PATTERNS.includes(file)) continue;
            const filePath = path.join(directory, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                // Recursively process subdirectories
                await TemplateUtils.processTemplateFiles(filePath, variables);
            } else if (
                // Only process text files
                file.endsWith('.json') ||
                file.endsWith('.ts') ||
                file.endsWith('.js') ||
                file.endsWith('.md') ||
                file.endsWith('.html') ||
                file.endsWith('.yml') ||
                file.endsWith('.yaml')
            ) {
                let content = await fs.readFile(filePath, 'utf8');

                // Replace placeholders
                for (const [key, value] of Object.entries(variables)) {
                    content = content.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
                }

                await fs.writeFile(filePath, content)
            }
        }
    };

    /**
* Copy files and directories from one location to another
*/
    private static async copyTemplateFiles(sourceDir: string, targetDir: string): Promise<void> {
        const items = await fs.readdir(sourceDir);
        for (const item of items) {
            if(EXCLUDE_PATTERNS.includes(item)) continue;
            const sourcePath = path.join(sourceDir, item);
            const targetPath = path.join(targetDir, item);

            const stat = await fs.stat(sourcePath);

            if (stat.isDirectory()) {
                await fs.ensureDir(targetPath);
                await TemplateUtils.copyTemplateFiles(sourcePath, targetPath);
            } else {
                await fs.copyFile(sourcePath, targetPath);
            }
        }
    }
}