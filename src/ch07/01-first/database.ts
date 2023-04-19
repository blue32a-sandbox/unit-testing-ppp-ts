import { User, UserType } from './user';

type UserRow = {
  userId: number;
  email: string;
  type: UserType;
}

export function getUserById(userId: number): UserRow {
  return {
    userId,
    email: 'hoge@example.com',
    type: UserType.EMPLOYEE,
  }
}

export function saveUser(user: User): void {

}

type CompanyRow = {
  domainName: string;
  numberOfEmployees: number;
}

export function getCompany(): CompanyRow {
  return {
    domainName: 'example.com',
    numberOfEmployees: 10,
  }
}

export function saveCompany(newNumber: number): void {

}
