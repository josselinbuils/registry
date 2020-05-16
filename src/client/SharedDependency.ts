import { RegistryDependency } from './RegistryDependency';

export interface SharedDependency extends RegistryDependency {
  version: string;
  content?: any;
  factory(): Promise<any>;
}
