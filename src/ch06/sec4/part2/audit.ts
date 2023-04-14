import path from 'path';
import { FileSystem } from './fs';

export class AuditManager {
  constructor(
    private readonly maxEntriesPerFile: number,
    private readonly directoryName: string,
    private readonly fileSystem: FileSystem
  ) {}

  public addRecord(visitorName: string, timeOfVisit: Date): void {
    const files = this.fileSystem.getFiles(this.directoryName);
    const sortedFiles = this.sortByIndex(files);

    const newRecord = visitorName + ';' + timeOfVisit.toISOString();

    if (sortedFiles.length === 0) {
      const newFile = path.join(this.directoryName, 'audit_1.txt');
      this.fileSystem.writeAllText(newFile, newRecord);
      return;
    }

    const [currentFileIndex, currentFile] = sortedFiles[sortedFiles.length - 1];
    const currentFilePath = path.join(this.directoryName, currentFile);
    const lines = this.fileSystem.readAllLines(currentFilePath);

    if (lines.length < this.maxEntriesPerFile) {
      lines.push(newRecord);
      const newContent = lines.join('\n');
      this.fileSystem.writeAllText(currentFilePath, newContent);
    } else {
      const newIndex = currentFileIndex + 1;
      const newName = `audit_${newIndex}.txt`;
      const newFile = path.join(this.directoryName, newName);
      this.fileSystem.writeAllText(newFile, newRecord);
    }
  }

  private sortByIndex(files: string[]): [number, string][] {
    return [...files].sort((a, b) => {
      const ai = this.getIndex(a);
      const bi = this.getIndex(b);
      if (ai > bi) return 1;
      if (ai < bi) return -1;
      return 0;
    }).map((file) => [this.getIndex(file), file]);
  }

  private getIndex(file: string): number {
    const name = path.parse(file)['name'];
    return parseInt(name.split('_')[1]);
  }
}
