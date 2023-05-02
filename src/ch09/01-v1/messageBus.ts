export interface IMessageBus {
  sendEmailChangedMessage(userId: number, newEmail: string): void;
}

export class MessageBus implements IMessageBus {
  constructor(
    private readonly bus: IBus
  ) { }

  sendEmailChangedMessage(userId: number, newEmail: string): void {
    this.bus.send(`Type: USER EMAIL CHANGED; Id: ${userId}; NewEmail: ${newEmail}`);
  }
}

export interface IBus {
  send(message: string): void;
}
