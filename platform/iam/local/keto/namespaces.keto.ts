import { Namespace, SubjectSet, Context } from "@ory/keto-namespace-types";

class User implements Namespace {}

class Group implements Namespace {
  related: {
    members: (User | Group)[];
  };
}

class Organization implements Namespace {
  related: {
    relationshipManagers: (User | Group)[];
    branchEmployees: (User | Group)[];
    customerCare: (User | Group)[];
    collectionAgents: (User | Group)[];
    admins: (User | Group)[];
    techSupport: (User | Group)[];

    consumers: (User | Group)[];

    partnerAdmins: (User | Group)[];
    partnerCashiers: (User | Group)[];
  };

  permits = {
    searchConsumers: (ctx: Context): boolean =>
      this.related.admins.includes(ctx.subject) || this.related.techSupport.includes(ctx.subject) || this.related.branchEmployees.includes(ctx.subject),
    printConsumerDocuments: (ctx: Context): boolean => this.permits.searchConsumers(ctx),
    activateConsumer: (ctx: Context): boolean => this.related.admins.includes(ctx.subject) || this.related.branchEmployees.includes(ctx.subject),

    searchPartners: (ctx: Context): boolean =>
      this.related.admins.includes(ctx.subject) || this.related.techSupport.includes(ctx.subject) || this.related.relationshipManagers.includes(ctx.subject),
    createPartner: (ctx: Context): boolean => this.related.admins.includes(ctx.subject) || this.related.relationshipManagers.includes(ctx.subject),
    createCashier: (ctx: Context): boolean => this.permits.createPartner(ctx),

    searchCollections: (ctx: Context): boolean =>
      this.related.admins.includes(ctx.subject) || this.related.techSupport.includes(ctx.subject) || this.related.collectionAgents.includes(ctx.subject),
    makeCollection: (ctx: Context): boolean => this.related.admins.includes(ctx.subject) || this.related.collectionAgents.includes(ctx.subject),

    viewConsumer: (ctx: Context): boolean => this.related.admins.includes(ctx.subject) || this.related.customerCare.includes(ctx.subject),
    listTransactions: (ctx: Context): boolean => this.related.admins.includes(ctx.subject) || this.related.customerCare.includes(ctx.subject),

    acquireCheckoutBasket: (ctx: Context): boolean => this.related.consumers.includes(ctx.subject),

    administerPartner: (ctx: Context): boolean => this.related.partnerAdmins.includes(ctx.subject),
    initCheckout: (ctx: Context): boolean => this.related.partnerCashiers.includes(ctx.subject),
  };
}

class Partner implements Namespace {
  related: {
    admins: (User | SubjectSet<Group, "members">)[];
    cashiers: (User | SubjectSet<Group, "members">)[];
    branchesManagers: (User | SubjectSet<Group, "members">)[];
  };
  permits = {
    addCashier: (ctx: Context): boolean => this.related.admins.includes(ctx.subject)|| this.related.branchesManagers.includes(ctx.subject),
    removeCashier: (ctx: Context): boolean => this.permits.addCashier(ctx)|| this.related.admins.includes(ctx.subject),
    updateCashier: (ctx: Context): boolean => this.permits.addCashier(ctx)|| this.related.admins.includes(ctx.subject),
  };
}
