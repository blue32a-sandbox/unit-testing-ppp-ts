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

  public changeEmail(
    newEmail: string,
    companyDomainName: string,
    numberOfEmployees: number
  ): number {
    if (this._email == newEmail) {
      return numberOfEmployees;
    }

    const emailDomain = newEmail.split('@')[1];
    const isEmailCorporate = emailDomain === companyDomainName;
    const newType = isEmailCorporate ? UserType.EMPLOYEE : UserType.CUSTOMER;

    if (this._type != newType) {
      const delta = newType === UserType.EMPLOYEE ? 1 : -1;
      const newNumber = numberOfEmployees + delta;
      numberOfEmployees = newNumber;
    }

    this._email = newEmail;
    this._type = newType;

    return numberOfEmployees;
  }
}

export const UserType = {
  CUSTOMER: 1,
  EMPLOYEE: 2,
} as const;
export type UserType = typeof UserType[keyof typeof UserType];
