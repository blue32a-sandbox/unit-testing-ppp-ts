import { AuditManager } from './audit';
import { Presister } from './presister';

export class ApplicationService {
  private readonly directoryName: string;
  private readonly auditManager: AuditManager;
  private readonly persister: Presister;

  constructor(
    directoryName: string,
    maxEntriesPerFile: number
  ) {
    this.directoryName = directoryName;
    this.auditManager = new AuditManager(maxEntriesPerFile);
    this.persister = new Presister();
  }

  public addRecord(visitorName: string, timeOfVisit: Date): void {
    const files = this.persister.readDirectory(this.directoryName);
    const update = this.auditManager.addRecord(files, visitorName, timeOfVisit);
    this.persister.applyUpdate(this.directoryName, update);
  }
}
