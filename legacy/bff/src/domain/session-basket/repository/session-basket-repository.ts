import { camelizeKeys } from "humps";
import { SessionBasket } from "../models/session-basket";
import { SessionBasketRepositoryInterface } from "./session-basket-repository-interface";
import { db } from "../../../services/postgresql";
import { UUID } from "crypto";

class SessionBasketRepository implements SessionBasketRepositoryInterface {
  async find(id: UUID): Promise<SessionBasket | null> {
    const result = await db.query(`select * from session_baskets where id = $1 limit 1`, [id]);
    if (result.rowCount === 0) {
      return null;
    }

    return new SessionBasket(camelizeKeys<SessionBasket>(result.rows[0]));
  }

  async findActiveByConsumerId(consumerId: UUID): Promise<SessionBasket[]> {
    const baskets: SessionBasket[] = [];
    const result = await db.query(
      `select * from session_baskets where status IN ('CHECKOUT_INITIATED') AND consumer_id = $1`,
      [consumerId],
    );
    for (const row of result.rows) {
      baskets.push(new SessionBasket(camelizeKeys<SessionBasket>(row)));
    }

    return baskets;
  }

  async create(basket: SessionBasket): Promise<SessionBasket | null> {
    try {
      const { partnerId, branchId, cashierId, product, status, consumerId, partnerName } = basket;
      await db.query("BEGIN");
      const result = await db.query(
        `insert into session_baskets 
        (partner_id, branch_id, cashier_id, status, product, partner_name,consumer_id) 
         values ($1,$2,$3,$4,$5,$6,$7) returning partner_id,branch_id,cashier_id,status,product,partner_name,consumer_id,id`,
        [partnerId, branchId, cashierId, status, JSON.stringify(product), partnerName, consumerId],
      );
      const dbBasket = result.rows[0];
      const auditLogQuery = `insert into audit_logs (actor_id, actor_type, record_id, after) values ($1,$2,$3,$4)`;
      await db.query(auditLogQuery, [cashierId, "cashier", null, JSON.stringify(basket)]);
      await db.query("COMMIT");
      return new SessionBasket(camelizeKeys<SessionBasket>(dbBasket));
    } catch (e) {
      await db.query("ROLLBACK");
      throw e;
    }
  }
  async expired(basket: SessionBasket) {
    try {
      await db.query("BEGIN");
      await db.query(
        `update session_baskets set 
      status = $1, consumer_id = $2, updated_at = $3 where id = $4;`,
        [basket.status, basket.consumerId, new Date().toISOString(), basket.id],
      );
      const auditLogQuery = `insert into audit_logs ( actor_type, record_id, after) values ($1,$2,$3,$4)`;
      await db.query(auditLogQuery, ["system", basket.id, JSON.stringify(basket)]);
      await db.query("COMMIT");
    } catch (e) {
      await db.query("ROLLBACK");
      throw e;
    }
  }
  async fail(basket: SessionBasket) {
    try {
      await db.query("BEGIN");
      await db.query(
        `update session_baskets set 
      status = $1, updated_at = $2 where id = $3;`,
        [basket.status, new Date().toISOString(), basket.id],
      );
      const auditLogQuery = `insert into audit_logs (actor_id, actor_type, record_id, after) values ($1,$2,$3,$4)`;
      await db.query(auditLogQuery, [basket.consumerId, "system", basket.id, JSON.stringify(basket)]);
      await db.query("COMMIT");
    } catch (e) {
      await db.query("ROLLBACK");
      throw e;
    }
  }
  async cancelByCashier(basket: SessionBasket) {
    try {
      await db.query("BEGIN");
      await db.query(
        `update session_baskets set 
      status = $1, consumer_id = $2, updated_at = $3 where id = $4;`,
        [basket.status, basket.consumerId, new Date().toISOString(), basket.id],
      );
      const auditLogQuery = `insert into audit_logs (actor_id, actor_type, record_id, after) values ($1,$2,$3,$4)`;
      await db.query(auditLogQuery, [basket.consumerId, "cashier", basket.id, JSON.stringify(basket)]);
      await db.query("COMMIT");
    } catch (e) {
      await db.query("ROLLBACK");
      throw e;
    }
  }

}

export default SessionBasketRepository;
