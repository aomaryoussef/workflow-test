import { SessionBasket } from "../models/session-basket";
import { UUID } from "crypto";

export interface SessionBasketRepositoryInterface {
  find: (id: UUID) => Promise<SessionBasket | null>;
  findActiveByConsumerId: (consumerId: UUID) => Promise<SessionBasket[]>;
  create: (basket: Partial<SessionBasket>) => Promise<SessionBasket | null>;
  expired: (basket: SessionBasket) => Promise<void>;
  fail: (basket: SessionBasket) => Promise<void>;
  cancelByCashier: (basket: SessionBasket) => Promise<void>;
}
