export interface RegistryDependency {
  name: string;
  range: string;
  version: string;
  content?: any;
  factory(): Promise<any>;
}
