export class ValidationError extends Error {
  errors: string[];
  constructor(errors: string[]) {
    super("Validation Error");
    this.name = "ValidationError";
    this.errors = errors;
  }
}
