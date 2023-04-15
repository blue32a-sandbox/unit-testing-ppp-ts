import path from 'path';

export class AuditManager {
  constructor(
    private readonly maxEntriesPerFile: number
  ) {}

  public addRecord(
    files: FileContent[],
    visitorName: string,
    timeOfVisit: Date
  ): FileUpdate {
    const sortedFiles = this.sortByIndex(files);

    const newRecord = visitorName + ';' + timeOfVisit.toISOString();

    if (sortedFiles.length === 0) {
      return { fileName: 'audit_1.txt', newContent: newRecord };
    }

    const [currentFileIndex, currentFile] = sortedFiles[sortedFiles.length - 1];
    const lines = currentFile.lines;

    if (lines.length < this.maxEntriesPerFile) {
      lines.push(newRecord);
      const newContent = lines.join('\n');
      return { fileName: currentFile.fileName, newContent };
    } else {
      const newIndex = currentFileIndex + 1;
      const newName = `audit_${newIndex}.txt`;
      return { fileName: newName, newContent: newRecord };
    }
  }

  private sortByIndex(files: FileContent[]): [number, FileContent][] {
    return [...files].sort((a, b) => {
      const ai = this.getIndex(a.fileName);
      const bi = this.getIndex(b.fileName);
      if (ai > bi) return 1;
      if (ai < bi) return -1;
      return 0;
    }).map((file) => [this.getIndex(file.fileName), file]);
  }

  private getIndex(file: string): number {
    const name = path.parse(file)['name'];
    return parseInt(name.split('_')[1]);
  }
}

export type FileContent = {
  fileName: string;
  lines: string[];
}

export type FileUpdate = {
  fileName: string;
  newContent: string;
}
