import * as fs from 'fs';
import path from 'path';

export class AuditManager {
  constructor(
    private readonly maxEntriesPerFile: number,
    private readonly directoryName: string
  ) {}

  public addRecord(visitorName: string, timeOfVisit: Date): void {
    const files = fs.readdirSync(this.directoryName);
    const sortedFiles = this.sortByIndex(files);

    const newRecord = visitorName + ';' + timeOfVisit.toISOString();

    if (sortedFiles.length === 0) {
      const newFile = path.join(this.directoryName, 'audit_1.txt');
      fs.writeFileSync(newFile, newRecord);
      return;
    }

    const [currentFileIndex, currentFile] = sortedFiles[sortedFiles.length - 1];
    const currentFilePath = path.join(this.directoryName, currentFile);
    const data = fs.readFileSync(currentFilePath, 'utf8');
    const lines = data.split('\n');

    if (lines.length < this.maxEntriesPerFile) {
      lines.push(newRecord);
      const newContent = lines.join('\n');
      fs.writeFileSync(currentFilePath, newContent);
    } else {
      const newIndex = currentFileIndex + 1;
      const newName = `audit_${newIndex}.txt`;
      const newFile = path.join(this.directoryName, newName);
      fs.writeFileSync(newFile, newRecord);
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
