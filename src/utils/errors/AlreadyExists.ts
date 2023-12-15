import { ERROR_ALREADY_EXISTS } from '../statusCode';

export default class AlreadyExists extends Error {
  public statusCode: typeof ERROR_ALREADY_EXISTS;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_ALREADY_EXISTS;
  }
}
