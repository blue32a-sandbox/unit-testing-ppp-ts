import { Company } from './company';
import { User, UserType } from './user';

export type UserRow = {
  userId: number;
  email: string;
  type: UserType;
  isEmailConfirmed: boolean;
}

export type CompanyRow = {
  domainName: string;
  numberOfEmployees: number;
}

export class Database {
  getUserById(userId: number): UserRow {
    return {
      userId,
      email: 'hoge@example.com',
      type: UserType.EMPLOYEE,
      isEmailConfirmed: false,
    }
  }

  saveUser(user: User): void {

  }

  getCompany(): CompanyRow {
    return {
      domainName: 'example.com',
      numberOfEmployees: 10,
    }
  }

  saveCompany(company: Company): void {

  }
}
