import { UserRow } from './database';
import { User } from './user';

export function createUser(data: UserRow): User {
  return new User(data.userId, data.email, data.type);
}
