import { ERROR_AUTHORIZATION } from '../statusCode';

export default class Unathorized extends Error {
  public statusCode: typeof ERROR_AUTHORIZATION;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_AUTHORIZATION;
  }
}