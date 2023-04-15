import { AuditManager, FileContent } from './audit';

describe('AuditManager クラスは訪問者記録のビジネス・ロジックを扱う関数的核', () => {
  describe('addRecord メソッドは訪問者の記録情報を返す', () => {
    test('ファイルが無い状態の実行では audit_1.txt ファイルに訪問者が記録される', () => {
      const files: FileContent[]  = [];
      const audit = new AuditManager(1);

      const update = audit.addRecord(files, 'Jony', new Date('2023-04-10'));

      expect(update.fileName).toBe('audit_1.txt');
      expect(update.newContent).toBe('Jony;2023-04-10T00:00:00.000Z');
    });
    test('maxEntriesPerFile の回数までは同じファイルに追記される', () => {
      const files: FileContent[]  = [
        { fileName: 'audit_1.txt', lines: ['Jony;2023-04-10T00:00:00.000Z'] }
      ];
      const audit = new AuditManager(2);

      const update = audit.addRecord(files, 'Alice', new Date('2023-04-11'));

      expect(update.fileName).toBe('audit_1.txt');
      expect(update.newContent).toBe('Jony;2023-04-10T00:00:00.000Z\nAlice;2023-04-11T00:00:00.000Z');
    });
    test('maxEntriesPerFile 以上の回数になると、新しいファイルに記録される', () => {
      const files: FileContent[]  = [
        { fileName: 'audit_1.txt', lines: ['Jony;2023-04-10T00:00:00.000Z', 'Alice;2023-04-11T00:00:00.000Z'] }
      ];
      const audit = new AuditManager(2);

      const update = audit.addRecord(files, 'Peter', new Date('2023-04-12'));

      expect(update.fileName).toBe('audit_2.txt');
      expect(update.newContent).toBe('Peter;2023-04-12T00:00:00.000Z');
    });
  });
});
