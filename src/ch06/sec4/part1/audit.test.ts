import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { AuditManager } from './audit';

let dataDir = '';

beforeAll(() => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ch06-sec4-part1-'));
});

afterAll(() => {
  fs.rmSync(dataDir, { recursive: true });
});

describe('AuditManager クラスは訪問者の記録を扱う', () => {
  describe('addRecord メソッドはファイルに訪問者を記録する', () => {

    afterEach(() => {
      const files = fs.readdirSync(dataDir);
      files.forEach((file) => {
        fs.unlink(path.join(dataDir, file), (err) => {
          if (err) throw err;
        });
      });
    });

    test('ファイルが無い状態の実行では audit_1.txt ファイルが作成され、訪問者が記録される', () => {
      const audit = new AuditManager(1, dataDir);

      audit.addRecord('Jony', new Date('2023-04-10'));

      const files = fs.readdirSync(dataDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toBe('audit_1.txt');

      const data = fs.readFileSync(path.join(dataDir, 'audit_1.txt'), 'utf8');
      expect(data).toBe('Jony;2023-04-10T00:00:00.000Z');
    });
    test('maxEntriesPerFile の回数までは同じファイルに追記される', () => {
      const audit = new AuditManager(2, dataDir);

      audit.addRecord('Jony', new Date('2023-04-10'));
      audit.addRecord('Alice', new Date('2023-04-11'));

      const files = fs.readdirSync(dataDir);
      expect(files).toHaveLength(1);
      expect(files[0]).toBe('audit_1.txt');

      const data = fs.readFileSync(path.join(dataDir, 'audit_1.txt'), 'utf8');
      const lines = data.split('\n');
      expect(lines[0]).toBe('Jony;2023-04-10T00:00:00.000Z');
      expect(lines[1]).toBe('Alice;2023-04-11T00:00:00.000Z');
    });
    test('maxEntriesPerFile 以上の回数になると、新しいファイルに記録される', () => {
      const audit = new AuditManager(2, dataDir);

      audit.addRecord('Jony', new Date('2023-04-10'));
      audit.addRecord('Alice', new Date('2023-04-11'));
      audit.addRecord('Peter', new Date('2023-04-12'));

      const files = fs.readdirSync(dataDir);
      expect(files).toHaveLength(2);
      expect(files[0]).toBe('audit_1.txt');
      expect(files[1]).toBe('audit_2.txt');

      const data = fs.readFileSync(path.join(dataDir, 'audit_2.txt'), 'utf8');
      expect(data).toBe('Peter;2023-04-12T00:00:00.000Z');
    });
  });
});
