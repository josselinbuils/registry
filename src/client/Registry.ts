import { ExternalDependency } from './ExternalDependency';
import { SharedDependency } from './SharedDependency';

export interface Registry {
  externalDependencies: ExternalDependency[];
  sharedDependencies: SharedDependency[];
  // format: name@range
  get: { [dependency: string]: any };
}
