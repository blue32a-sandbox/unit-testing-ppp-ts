import { Database } from './database';
import { MessageBus } from './messageBus';
import { createCompany, createUser } from './factory';

export class UserController {
  private readonly database: Database;
  private readonly messageBus: MessageBus;

  constructor() {
    this.database = new Database();
    this.messageBus = new MessageBus();
  }

  changeEmail(userId: number, newEmail: string): string {
    const userData = this.database.getUserById(userId);
    const user = createUser(userData);

    const error = user.canChangeEmail();
    if (error != null) {
      return error;
    }

    const companyData = this.database.getCompany();
    const company = createCompany(companyData);

    user.changeEmail(newEmail, company);

    this.database.saveCompany(company);
    this.database.saveUser(user);
    this.messageBus.sendEmailChangedMessage(userId, newEmail);

    return 'OK';
  }
}
