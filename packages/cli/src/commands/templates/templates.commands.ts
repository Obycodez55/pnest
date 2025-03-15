import { Command } from "commander";
import { TemplateHandlers } from "./templates.handlers";


export class TemplateCommand{
    constructor(
        private readonly program: Command,
        private readonly templateHandlers: TemplateHandlers
    ) {}
}