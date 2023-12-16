import { ERROR_NOT_FOUND } from '../statusCode';

export default class NotFound extends Error {
  public statusCode: typeof ERROR_NOT_FOUND;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_NOT_FOUND;
  }
}
