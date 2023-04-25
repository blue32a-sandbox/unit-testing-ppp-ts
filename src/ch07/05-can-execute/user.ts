import { Company } from './company';
import { requires } from './precondition';

export class User {
  constructor(
    private _userId: number,
    private _email: string,
    private _type: UserType,
    private _isEmailConfirmed: boolean
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

  get isEmailConfirmed(): boolean {
    return this._isEmailConfirmed;
  }

  public canChangeEmail(): string | null {
    return this._isEmailConfirmed
      ? "Can't change email after it's confirmed"
      : null;
  }

  public changeEmail(newEmail: string, company: Company): void {
    requires(this.canChangeEmail() === null);

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
