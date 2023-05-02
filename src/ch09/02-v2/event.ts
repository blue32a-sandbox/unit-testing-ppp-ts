import { IDomainLogger } from './logger';
import { MessageBus } from './messageBus';
import { UserType } from './user';

export interface DomainEvent {}
export class UserTypeChangedEvent implements DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly oldType: UserType,
    public readonly newType: UserType
  ) { }
}
export class EmailChangedEvent implements DomainEvent {
  constructor(
    public readonly userId: number,
    public readonly newEmail: string
  ) { }
}

export class EventDispatcher {
  constructor(
    private readonly messageBus: MessageBus,
    private readonly domainLogger: IDomainLogger
  ) { }

  dispatch(events: DomainEvent[]): void {
    events.forEach((ev) => this.doDispatch(ev));
  }

  private doDispatch(ev: DomainEvent): void {
    if (ev instanceof EmailChangedEvent) {
      this.messageBus.sendEmailChangedMessage(ev.userId, ev.newEmail);
    } else if (ev instanceof UserTypeChangedEvent) {
      this.domainLogger.userTypeHasChanged(ev.userId, ev.oldType, ev.newType);
    }
  }
}
