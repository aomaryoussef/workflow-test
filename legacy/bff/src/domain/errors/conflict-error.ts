export class ConflictError extends Error {
  phone_number?: string; // Optional property for the additional parameter
  identity_conflict?: boolean; // Optional property for the additional parameter
  mc_conflict?: boolean; // Optional property for the additional parameter
  password_created?: boolean; // Optional property for the additional parameter

  constructor({
    message,
    phone_number,
    identity_conflict,
    mc_conflict,
    password_created,
  }: {
    message?: string;
    phone_number?: string;
    identity_conflict?: boolean;
    mc_conflict?: boolean;
    password_created?: boolean;
  } = {}) {
    super(message || "conflict");
    this.name = "ConflictError";
    if (phone_number !== undefined) {
      this.phone_number = phone_number;
    }
    if (identity_conflict !== undefined) {
      this.identity_conflict = identity_conflict;
    }
    if (mc_conflict !== undefined) {
      this.mc_conflict = mc_conflict;
    }
    if (password_created !== undefined) {
      this.password_created = password_created;
    }
    }
    }