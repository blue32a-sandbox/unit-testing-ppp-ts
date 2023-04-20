import { Company } from './company';

export class User {
  constructor(
    private _userId: number,
    private _email: string,
    private _type: UserType
  ) {}

  get userId(): number {
    return this._userId;
  }

  get email(): string {
    return this._email;
  }

  get type(): UserType {
    return this._type;
  }

  public changeEmail(newEmail: string, company: Company): void {
    if (this._email == newEmail) {
      return;
    }

    const newType = company.isEmailCorporate(newEmail)
      ? UserType.EMPLOYEE
      : UserType.CUSTOMER;

    if (this._type != newType) {
      const delta = newType === UserType.EMPLOYEE ? 1 : -1;
      company.changeNumberOfEmployees(delta);
    }

    this._email = newEmail;
    this._type = newType;
  }
}

export const UserType = {
  CUSTOMER: 1,
  EMPLOYEE: 2,
} as const;
export type UserType = typeof UserType[keyof typeof UserType];
