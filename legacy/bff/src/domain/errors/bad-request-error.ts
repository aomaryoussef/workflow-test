export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message || "not found");
    this.name = "NotFoundError";
  }
}
