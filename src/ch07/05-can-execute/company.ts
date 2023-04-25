import { requires } from './precondition';

export class Company {
  constructor(
    private _domainName: string,
    private _numberOfEmployees: number
  ) { }

  get domainName(): string {
    return this._domainName;
  }

  get numberOfEmployees(): number {
    return this._numberOfEmployees;
  }

  public changeNumberOfEmployees(delta: number): void {
    requires(this._numberOfEmployees + delta >= 0);

    this._numberOfEmployees += delta;
  }

  public isEmailCorporate(email: string): boolean {
    const emailDomain = email.split('@')[1];
    return emailDomain === this._domainName;
  }
}
