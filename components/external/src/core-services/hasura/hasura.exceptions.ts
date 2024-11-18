export class RecordNotFoundException extends Error {
  constructor(message: string = 'Record not found') {
    super(message);
    this.name = 'RecordNotFoundException';
  }
}

export class InvalidInputException extends Error {
  constructor(message: string = 'Invalid input') {
    super(message);
    this.name = 'InvalidInputException';
  }
}
