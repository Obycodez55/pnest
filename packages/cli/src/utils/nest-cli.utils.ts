import path from "path";
import fs from "fs-extra";
import execa from "execa";
import chalk from "chalk";


export async function executeNestCommand(command: string): Promise<void> {
    try {
        let nestBin = path.resolve("node_modules", ".bin", "nest");
        if (!await fs.pathExists(nestBin)) {
            // Check for global installation of nestjs
            try {
                await execa('which', ['nest']);
                nestBin = 'nest';
            } catch (error) {
                throw new Error('NestJS CLI not found. Please install it with "npm install -g @nestjs/cli"');
            }
        }

        // Excecute the command
        const subProcess = execa(nestBin, command.split(" "), {
            stdout: "inherit",
            shell: true,
        });
        await subProcess;
        if (subProcess.exitCode !== 0) {
            console.error(chalk.red(`NestJS command failed with exit code ${subProcess.exitCode}`));
            process.exit(subProcess.exitCode);
        }
    } catch (error) {
        console.error(chalk.red(`Failed to execute NestJS command: ${error.message}`));
        process.exit(1);
    }
}


export async function isNestProject(): Promise<boolean> {
    try {
        const packageJsonPath = path.resolve(process.cwd(), "package.json");
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJSON(packageJsonPath);
            // Check for NestJS dependencies
            const hasDependency = packageJson.dependencies &&
                (packageJson.dependencies['@nestjs/core'] || packageJson.dependencies['@nestjs/common']);

            const hasDevDependency = packageJson.devDependencies &&
                packageJson.devDependencies['@nestjs/cli'];

            return !!(hasDependency || hasDevDependency);
        }
        return false;
    } catch (error) {
        return false;
    }
}