import { Company } from './company';
import { User, UserType } from './user';

describe('Userクラスはユーザについて扱う', () => {
  describe('changeEmail メソッドはユーザのメールアドレスを変更する', () => {
    test('メール・アドレスを非従業員のものから従業員のものに変える', () => {
      const company = new Company('mycorp.com', 1);
      const sut = new User(1, 'user@gmail.com', UserType.CUSTOMER, false);

      sut.changeEmail('new@mycorp.com', company);

      expect(company.numberOfEmployees).toBe(2);
      expect(sut.email).toBe('new@mycorp.com');
      expect(sut.type).toBe(UserType.EMPLOYEE);
    });
    test('メール・アドレスを従業員のものから非従業員のものに変える', () => {
      const company = new Company('mycorp.com', 2);
      const sut = new User(1, 'user@mycorp.com', UserType.EMPLOYEE, false);

      sut.changeEmail('new@gmail.com', company);

      expect(company.numberOfEmployees).toBe(1);
      expect(sut.email).toBe('new@gmail.com');
      expect(sut.type).toBe(UserType.CUSTOMER);
    });
    test('ユーザの種類を変えずにメール・アドレスを変える', () => {
      const company = new Company('mycorp.com', 2);
      const sut = new User(1, 'user@mycorp.com', UserType.EMPLOYEE, false);

      sut.changeEmail('new@mycorp.com', company);

      expect(company.numberOfEmployees).toBe(2);
      expect(sut.email).toBe('new@mycorp.com');
      expect(sut.type).toBe(UserType.EMPLOYEE);
    });
    test('メール・アドレスを同じメールアドレスで変える', () => {
      const company = new Company('mycorp.com', 1);
      const sut = new User(1, 'user@gmail.com', UserType.CUSTOMER, false);

      sut.changeEmail('user@gmail.com', company);

      expect(company.numberOfEmployees).toBe(1);
      expect(sut.email).toBe('user@gmail.com');
      expect(sut.type).toBe(UserType.CUSTOMER);
    });
    test('メール・アドレスが確定された後は変更ができない', () => {
      const company = new Company('mycorp.com', 1);
      const sut = new User(1, 'user@gmail.com', UserType.CUSTOMER, true);

      const act = () => sut.changeEmail('new@mycorp.com', company);

      expect(act).toThrow();
    });
  });
});
