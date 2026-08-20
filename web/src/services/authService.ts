import { users } from '../mock/data';
import type { User } from '../types';
import { mockRequest } from './apiClient';

export async function login(username: string, password: string): Promise<User> {
  const matchedUser = users.find((u) => u.username === username && u.password === password);

  if (!matchedUser) {
    throw new Error('Invalid username or password.');
  }

  const { password: _password, ...user } = matchedUser;
  const response = await mockRequest(user);
  return response.data;
}
