import fs from 'fs-extra';
import chalk from "chalk";
import path from 'path';

export class FileUtils {

    static addScriptToPackageJson(scriptName: string, scriptCommand: string): void {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            console.error(chalk.red(`package.json not found at ${packageJsonPath}`));
            return;
        }
        const packageJson = fs.readJSONSync(packageJsonPath);
        if (!packageJson.scripts) {
            packageJson.scripts = {};
        }
        packageJson.scripts[scriptName] = scriptCommand;
        fs.writeJSONSync(packageJsonPath, packageJson, { spaces: 2 });
    }

    static async addFile(filePath: string, content: string): Promise<void> {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            await fs.mkdirp(dir);
        }
        await fs.writeFile(filePath, content);
    }
}