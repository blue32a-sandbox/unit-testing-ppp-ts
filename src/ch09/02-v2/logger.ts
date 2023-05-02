import { UserType } from './user';

export interface ILogger {
  info(message: string): void;
}

export interface IDomainLogger {
  userTypeHasChanged(userId: number, oldType: UserType, newType: UserType): void;
}

export class DomainLogger implements IDomainLogger {
  constructor(
    private readonly logger: ILogger
  ) { }

  userTypeHasChanged(userId: number, oldType: UserType, newType: UserType): void {
    this.logger.info(`User ${userId} changed type from ${oldType} to ${newType}`);
  }
}
