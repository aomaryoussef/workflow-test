export class ExpiryError extends Error {
  constructor(message?: string) {
    super(message || "expired");
    this.name = "ExpiryError";
  }
}
