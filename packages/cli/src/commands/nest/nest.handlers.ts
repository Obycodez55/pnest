import { NestUtils } from './nest.utils';

export class NestHandlers {
    constructor() { }
    // Placeholder for any future handlers related to NestJS commands
    // Currently, this class is empty but can be expanded as needed

    async handlePasssthroughCommand(command: string, options: Record<string, string>): Promise<void> {
        // This method can be used to handle passthrough commands
        // For now, it just logs the command and options

        const args = [command, ...(Array.isArray(options) ? options : [])];
        return NestUtils.executeNestCommand(args.join(' '));
    }
}