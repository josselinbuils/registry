import { SharedDependency } from './SharedDependency';

export interface Registry {
  sharedDependencies: SharedDependency[];
  // format: name@range
  get: { [dependency: string]: any };
}
