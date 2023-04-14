export interface FileSystem {
  getFiles(directoryName: string): string[];
  writeAllText(filePath: string, content: string): void;
  readAllLines(filePath: string): string[];
}
