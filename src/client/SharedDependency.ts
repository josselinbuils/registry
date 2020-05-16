export interface SharedDependency {
  name: string;
  version: string;
  module?: any;
  factory(): Promise<any>;
}
