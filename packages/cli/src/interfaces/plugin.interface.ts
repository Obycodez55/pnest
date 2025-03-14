export interface PNestPlugin {
  name: string;
  version: string;
  description: string;
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  providers: string[];
  setup(provider: string, options?: any): Promise<void>;
  cleanup(): Promise<void>;
  getModuleImport(provider: string): string;
}

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  providers: {
    name: string;
    description: string;
    isDefault?: boolean;
  }[];
}
