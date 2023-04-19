import * as database from './database';
import * as messageBus from './messageBus';

export class User {
  private _userId?: number;
  private _email?: string;
  private _type?: UserType;

  get userId(): number | undefined {
    return this._userId;
  }

  get email(): string | undefined {
    return this._email;
  }

  get type(): UserType | undefined {
    return this._type;
  }

  public changeEmail(userId: number, newEmail: string): void {
    const data = database.getUserById(userId);
    this._userId = userId;
    this._email = data.email;
    this._type = data.type;

    if (this._email == newEmail) {
      return;
    }

    const companyData = database.getCompany();
    const companyDomainName = companyData.domainName;
    const numberOfEmployees = companyData.numberOfEmployees;

    const emailDomain = newEmail.split('@')[1];
    const isEmailCorporate = emailDomain === companyDomainName;
    const newType = isEmailCorporate ? UserType.EMPLOYEE : UserType.CUSTOMER;

    if (this._type != newType) {
      const delta = newType === UserType.EMPLOYEE ? 1 : -1;
      const newNumber = numberOfEmployees + delta;
      database.saveCompany(newNumber);
    }

    this._email = newEmail;
    this._type = newType;

    database.saveUser(this);
    messageBus.sendEmailChangedMessage(this._userId, newEmail);
  }
}

export const UserType = {
  CUSTOMER: 1,
  EMPLOYEE: 2,
} as const;
export type UserType = typeof UserType[keyof typeof UserType];
