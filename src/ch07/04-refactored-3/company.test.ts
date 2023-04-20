import { Company } from './company';

describe('Companyクラスは会社について扱う', () => {
  describe('changeNumberOfEmployees メソッドは会社の従業員数を変更する', () => {
    test('引数 delta が正の整数の場合、その数だけ従業員数を増加させる', () => {
      const company = new Company('example.co.jp', 10);

      company.changeNumberOfEmployees(1);

      expect(company.numberOfEmployees).toBe(11);
    });
    test('引数 delta が負の整数の場合、その数だけ従業員数を減少させる', () => {
      const company = new Company('example.co.jp', 10);

      company.changeNumberOfEmployees(-1);

      expect(company.numberOfEmployees).toBe(9);
    });
    test('従業員数を変更した結果、マイナスの数になってしまう場合はエラーが発生する', () => {
      const company = new Company('example.co.jp', 1);

      const act = () => company.changeNumberOfEmployees(-2);

      expect(act).toThrow();
    });
  });
  describe('isEmailCorporate メソッドは会社に属するメールアドレスかどうかを判定する', () => {
    test.each([
      ['mycorp.com', 'email@mycorp.com', true],
      ['mycorp.com', 'email@gmail.com', false],
    ])('従業員のメールアドレスと非従業員のメールアドレスを区別する_%s_%s',
    (domain: string, email: string, expectedResult: boolean) => {
      const sut = new Company(domain, 0);

      const isEmailCorporate = sut.isEmailCorporate(email);

      expect(isEmailCorporate).toBe(expectedResult);
    });
  });
});
