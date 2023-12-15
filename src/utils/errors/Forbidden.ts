import { ERROR_FORBIDDEN } from '../statusCode';

export default class Forbidden extends Error {
  public statusCode: typeof ERROR_FORBIDDEN;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_FORBIDDEN;
  }
}
