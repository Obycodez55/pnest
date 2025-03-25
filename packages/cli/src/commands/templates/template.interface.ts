export interface Template {
  name: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
}

export interface TemplateCreateOptions{
  skipGit: boolean;
  skipInstall: boolean;
  docker: boolean;
}

export interface ProjectCreateOptions extends TemplateCreateOptions {
  name?: string;
  directory?: string;
}