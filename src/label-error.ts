export class MissingLabelPrefixError extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, MissingLabelPrefixError.prototype);
  }
}
