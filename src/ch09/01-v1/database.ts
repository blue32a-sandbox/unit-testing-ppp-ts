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
  constructor(
    private readonly connectionString: string
  ) { }

  getUserById(userId: number): UserRow {
    return {
      userId,
      email: 'user@mycorp.com',
      type: UserType.EMPLOYEE,
      isEmailConfirmed: false,
    }
  }

  saveUser(user: User): void {

  }

  getCompany(): CompanyRow {
    return {
      domainName: 'mycorp.com',
      numberOfEmployees: 1,
    }
  }

  saveCompany(company: Company): void {

  }
}
