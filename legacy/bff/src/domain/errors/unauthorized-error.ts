export class UnAuthorizedError extends Error {
  constructor(message?: string) {
    super(message || "Unauthorized");
    this.name = "UnAuthorizedError";
  }
}
