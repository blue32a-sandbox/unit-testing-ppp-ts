import { Company } from './company';
import { CompanyRow, UserRow } from './database';
import { User } from './user';

export function createUser(data: UserRow): User {
  return new User(data.userId, data.email, data.type, data.isEmailConfirmed, []);
}

export function createCompany(data: CompanyRow): Company {
  return new Company(data.domainName, data.numberOfEmployees);
}
