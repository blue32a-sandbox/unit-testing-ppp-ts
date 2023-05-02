import { Database } from './database';
import { IMessageBus } from './messageBus';
import { createCompany, createUser } from './factory';
import { IDomainLogger } from './logger';
import { EventDispatcher } from './event';

export class UserController {
  private readonly database: Database;
  private readonly eventDispatcher: EventDispatcher;

  constructor(
    database: Database,
    messageBus: IMessageBus,
    domainLogger: IDomainLogger
  ) {
    this.database = database;
    this.eventDispatcher = new EventDispatcher(messageBus, domainLogger);
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
    this.eventDispatcher.dispatch(user.domainEvents);

    return 'OK';
  }
}
