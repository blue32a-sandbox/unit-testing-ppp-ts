import fs from 'fs';
import path from 'path';
import { FileContent, FileUpdate } from './audit';

export class Presister {
  public readDirectory(directoryName: string): FileContent[] {
    const files = fs.readdirSync(directoryName);
    return files.map((file) => {
      const filePath = path.join(directoryName, file);
      return {
        fileName: file,
        lines: fs.readFileSync(filePath, 'utf8').split('\n')
      }
    });
  }
  public applyUpdate(directoryName: string, update: FileUpdate): void {
    const filePath = path.join(directoryName, update.fileName);
    fs.writeFileSync(filePath, update.newContent);
  }
}
