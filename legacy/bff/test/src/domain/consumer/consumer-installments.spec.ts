import { Installment, InstallmentStatuses } from "../../../../src/domain/consumer/models/installment";
describe("Installments", () => {
  describe("Payment due date is in one month", () => {
    const dueDateInOneMonthFromNow = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1);
    const principalDue = 1000;
    const interestDue = 100;
    const installment = new Installment("BTECH", dueDateInOneMonthFromNow, null, principalDue, interestDue, 0, 0, 0, 0, 412, "314a982d-d805-45d1-8130-4462176f38a4");
    it("status is upcoming", () => {
      expect(installment.status).toBe(InstallmentStatuses.UPCOMING);
    });
    it("amount is principal due  + interest due", () => {
      expect(installment.amount).toEqual(principalDue + interestDue);
    });
  });
  describe("Payment due date is today", () => {
    const dueDateIsToday = new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDay());
    const principalDue = 1000;
    const interestDue = 100;
    const installment = new Installment("BTECH", dueDateIsToday, null, principalDue, interestDue, 0, 0, 0, 0, 412, "314a982d-d805-45d1-8130-4462176f38a4");
    it("status is Due", () => {
      expect(installment.status).toBe(InstallmentStatuses.DUE);
    });
    it("amount is principal due  + interest due", () => {
      expect(installment.amount).toEqual(principalDue + interestDue);
    });
  });
  describe("Payment due date has passed and late fee is not 0", () => {
    const dueDatePassed = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDay());
    const principalDue = 1000;
    const interestDue = 100;
    const lateFeeDue = 50;
    const installment = new Installment("BTECH", dueDatePassed, null, principalDue, interestDue, lateFeeDue, 0, 0, 0, 412, "314a982d-d805-45d1-8130-4462176f38a4");
    it("status is Due", () => {
      expect(installment.status).toBe(InstallmentStatuses.LATE_FEES_APPLIED);
    });
    it("amount is principal due  + interest due + late fees", () => {
      expect(installment.amount).toEqual(principalDue + interestDue + lateFeeDue);
    });
  });
  describe("Payment due date has passed and paid date is same as due date", () => {
    const dueDatePassed = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDay());
    const paidDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDay());
    const principalDue = 1000;
    const interestDue = 100;
    const installment = new Installment(
      "BTECH",
      dueDatePassed,
      paidDate,
      principalDue,
      interestDue,
      0,
      principalDue,
      interestDue,
      0,
      412, "314a982d-d805-45d1-8130-4462176f38a4");
    it("status is Paid", () => {
      expect(installment.status).toBe(InstallmentStatuses.PAID);
    });
    it("amount is principal due  + interest due", () => {
      expect(installment.amount).toEqual(principalDue + interestDue);
    });
  });
});
