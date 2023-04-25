import { CompanyRow, UserRow } from './database';
import { createCompany, createUser } from './factory';
import { UserType } from './user';

describe('factory はデータ生成を扱うモジュール', () => {
  describe('createUser メソッドはユーザを生成する', () => {
    test('データベースのデータ行からUserクラスのインスタンスを生成して返す', () => {
      const row: UserRow = {
        userId: 1,
        email: 'foo@example.com',
        type: UserType.CUSTOMER,
        isEmailConfirmed: false,
      };

      const result = createUser(row);

      expect(result.userId).toBe(row.userId);
      expect(result.email).toBe(row.email);
      expect(result.type).toBe(row.type);
      expect(result.isEmailConfirmed).toBe(row.isEmailConfirmed);
    });
  });
  describe('factoryCompany メソッドは会社を生成する', () => {
    test('データベースのデータ行からCompanyクラスのインスタンスを生成して返す', () => {
      const row: CompanyRow = {
        domainName: 'example.co.jp',
        numberOfEmployees: 10,
      }

      const result = createCompany(row);

      expect(result.domainName).toBe(row.domainName);
      expect(result.numberOfEmployees).toBe(row.numberOfEmployees);
    });
  });
});
