import { AuditManager } from './audit';
import { FileSystem } from './fs';

const getFilesMock = jest.fn();
const writeAllTextMock = jest.fn();
const readAllLinesMock = jest.fn();
const FileSystemMock = jest.fn<FileSystem, []>().mockImplementation(() => ({
  getFiles: getFilesMock,
  writeAllText: writeAllTextMock,
  readAllLines: readAllLinesMock,
}));

const dataDir = '/path/to';

describe('AuditManager クラスは訪問者の記録を扱う', () => {
  describe('addRecord メソッドはファイルに訪問者を記録する', () => {

    afterEach(() => {
      getFilesMock.mockReset();
      writeAllTextMock.mockReset();
      readAllLinesMock.mockReset();
    });

    test('ファイルが無い状態の実行では audit_1.txt ファイルが作成され、訪問者が記録される', () => {
      getFilesMock.mockReturnValue([]);
      const fileSystem = new FileSystemMock();
      const audit = new AuditManager(1, dataDir, fileSystem);

      audit.addRecord('Jony', new Date('2023-04-10'));

      expect(writeAllTextMock).toBeCalledTimes(1);
      expect(writeAllTextMock)
        .toHaveBeenCalledWith('/path/to/audit_1.txt', 'Jony;2023-04-10T00:00:00.000Z');
    });
    test('maxEntriesPerFile の回数までは同じファイルに追記される', () => {
      getFilesMock
        .mockReturnValueOnce([])
        .mockReturnValueOnce(['audit_1.txt']);
      readAllLinesMock.mockReturnValue(['Jony;2023-04-10T00:00:00.000Z']);
      const fileSystem = new FileSystemMock();
      const audit = new AuditManager(2, dataDir, fileSystem);

      audit.addRecord('Jony', new Date('2023-04-10'));
      audit.addRecord('Alice', new Date('2023-04-11'));

      expect(writeAllTextMock).toBeCalledTimes(2);
      expect(writeAllTextMock.mock.calls[0])
        .toEqual(['/path/to/audit_1.txt', 'Jony;2023-04-10T00:00:00.000Z']);
      expect(writeAllTextMock.mock.calls[1])
        .toEqual(['/path/to/audit_1.txt', 'Jony;2023-04-10T00:00:00.000Z\nAlice;2023-04-11T00:00:00.000Z']);
    });
    test('maxEntriesPerFile 以上の回数になると、新しいファイルに記録される', () => {
      getFilesMock
        .mockReturnValueOnce([])
        .mockReturnValueOnce(['audit_1.txt'])
        .mockReturnValueOnce(['audit_1.txt']);
      readAllLinesMock
        .mockReturnValueOnce(['Jony;2023-04-10T00:00:00.000Z'])
        .mockReturnValueOnce(['Jony;2023-04-10T00:00:00.000Z', 'Alice;2023-04-11T00:00:00.000Z']);
      const fileSystem = new FileSystemMock();
      const audit = new AuditManager(2, dataDir, fileSystem);

      audit.addRecord('Jony', new Date('2023-04-10'));
      audit.addRecord('Alice', new Date('2023-04-11'));
      audit.addRecord('Peter', new Date('2023-04-12'));

      expect(writeAllTextMock).toBeCalledTimes(3);
      expect(writeAllTextMock.mock.calls[0])
        .toEqual(['/path/to/audit_1.txt', 'Jony;2023-04-10T00:00:00.000Z']);
      expect(writeAllTextMock.mock.calls[1])
        .toEqual(['/path/to/audit_1.txt', 'Jony;2023-04-10T00:00:00.000Z\nAlice;2023-04-11T00:00:00.000Z']);
      expect(writeAllTextMock.mock.calls[2])
        .toEqual(['/path/to/audit_2.txt', 'Peter;2023-04-12T00:00:00.000Z']);
    });
  });
});
