export type Registry = {
  name: string;
  version: string;
  factory(): Promise<void>;
}[];
