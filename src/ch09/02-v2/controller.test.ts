import { Company } from './company';
import { UserController } from './controller';
import { CompanyRow, Database, UserRow } from './database';
import { createCompany, createUser } from './factory';
import { IDomainLogger } from './logger';
import { IBus, MessageBus } from './messageBus';
import { User, UserType } from './user';


const connectionString = 'samedb:database=unittestingppp';

describe('UserController クラスはユーザ管理に関するコントローラ', () => {
  describe('changeEmail メソッドはユーザのメール・アドレスを変更する', () => {
    test('メール・アドレスを従業員のものから非従業員のものに変える', () => {
      // Arrange
      const db = new Database(connectionString);
      const user = createAndSaveUser('user@mycorp.com', UserType.EMPLOYEE, db);
      createAndSaveCompany('mycorp.com', 1, db);

      const bus = new BusSpy();
      const busSendSpy = jest.spyOn(bus, 'send');
      const messageBus = new MessageBus(bus);
      const userTypeHasChangedMock = jest.fn();
      const loggerMock = jest.fn<IDomainLogger, []>().mockImplementation(() => ({
        userTypeHasChanged: userTypeHasChangedMock
      }));
      const sut = new UserController(db, messageBus, new loggerMock());

      // Act
      const result = sut.changeEmail(user.userId, 'new@gmail.com');

      // Assert
      expect(result).toBe('OK');

      const userData = getUserById(user.userId, db);
      const userFromDb = createUser(userData);
      expect(userFromDb.email).toBe('new@gmail.com');
      expect(userFromDb.type).toBe(UserType.CUSTOMER);

      const companyData = getCompany(db);
      const companyFromDb = createCompany(companyData);
      expect(companyFromDb.numberOfEmployees).toBe(0);

      expect(busSendSpy).toHaveBeenCalledTimes(1);
      expect(busSendSpy).toHaveBeenCalledWith(`Type: USER EMAIL CHANGED; Id: ${user.userId}; NewEmail: new@gmail.com`);
      expect(userTypeHasChangedMock).toHaveBeenCalledTimes(1);
      expect(userTypeHasChangedMock).toHaveBeenCalledWith(user.userId, UserType.EMPLOYEE, UserType.CUSTOMER);
    });
  });
});

function createAndSaveCompany(domainName: string, numberOfEmployees: number, database: Database): Company {
  const company = new Company(domainName, numberOfEmployees);
  database.saveCompany(company);
  return company;
}

function getCompany(_database: Database): CompanyRow {
  return {
    domainName: 'mycorp.com',
    numberOfEmployees: 0,
  }
}

function createAndSaveUser(email: string, type: UserType, database: Database): User {
  const user = new User(0, email, type, false);
  database.saveUser(user);
  return user;
}

function getUserById(userId: number, _database: Database): UserRow {
  return {
    userId,
    email: 'new@gmail.com',
    type: UserType.CUSTOMER,
    isEmailConfirmed: false,
  }
}

class BusSpy implements IBus {
  send(_message: string): void {
  }
}
