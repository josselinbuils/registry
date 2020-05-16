import { RegistryDependency } from './RegistryDependency';

export interface Registry {
  dependencies: RegistryDependency[];
  get(name: string, range: string): any;
}
