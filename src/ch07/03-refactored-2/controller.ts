import { Database } from './database';
import { MessageBus } from './messageBus';
import { createUser } from './factory';

export class UserController {
  private readonly database: Database;
  private readonly messageBus: MessageBus;

  constructor() {
    this.database = new Database();
    this.messageBus = new MessageBus();
  }

  changeEmail(userId: number, newEmail: string): void {
    const userData = this.database.getUserById(userId);
    const user = createUser(userData);

    const companyData = this.database.getCompany();
    const companyDomainName = companyData.domainName;
    const numberOfEmployees = companyData.numberOfEmployees;

    const newNumberOfEmployees = user.changeEmail(
      newEmail, companyDomainName, numberOfEmployees);

    this.database.saveCompany(newNumberOfEmployees);
    this.database.saveUser(user);
    this.messageBus.sendEmailChangedMessage(userId, newEmail);
  }
}
