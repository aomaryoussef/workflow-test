import {
  InvoicingTransactionRepository
} from "../../../../src/domain/merchant/repository/invoicing-transaction.repository";
import {MerchantInvoiceUseCase} from "../../../../src/domain/merchant/use-cases/merchant-invoice.use-case";
import {createTestingModule} from "../../../utils/test-utils";
import {InvoicingTransaction} from "../../../../src/domain/merchant/models/invoicing-transaction.entity";
import {Logger} from "@nestjs/common";
import {
  CreateInvoicingTransactionInputDTO
} from "../../../../src/domain/merchant/dto/tasks/create-invoicing-transaction.dto";
import {PaymentConnectorType} from "../../../../src/domain/merchant/types/payment-connector.type";
import {DataSource} from "typeorm";

describe('MerchantInvoiceUseCase', () => {
  let invoicingTransactionRepository: InvoicingTransactionRepository;
  let merchantInvoiceUseCase: MerchantInvoiceUseCase;
  let dataSource: DataSource;
  beforeAll(async () => {
    const moduleRef = await createTestingModule([InvoicingTransaction], [InvoicingTransactionRepository, MerchantInvoiceUseCase,
      {
        provide: "CUSTOM_LOGGER",
        useValue: jest.fn(() => {
          return new Logger();
      })}
    ]);
    dataSource = moduleRef.get<DataSource>(DataSource);

    invoicingTransactionRepository = moduleRef.get<InvoicingTransactionRepository>(InvoicingTransactionRepository);
    merchantInvoiceUseCase = moduleRef.get<MerchantInvoiceUseCase>(MerchantInvoiceUseCase);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    await dataSource.getRepository(InvoicingTransaction).delete({});
  });

  describe('createInvoicingRecord', () => {
    it("should create a new invoicing record", async () => {
      const dto: CreateInvoicingTransactionInputDTO = {
        reference_id: 'ref123',
        payment_account_id: 'acc456',
        payment_connector_type: PaymentConnectorType.MS_DYNAMICS,
        payable_units: 1000,
        payable_currency: 'EGP',
        narration_comment: 'Loan activation',
        transaction_date: new Date(),
      };

      const result = await merchantInvoiceUseCase.createInvoicingRecord(dto);

      expect(result).not.toBeNull();
      expect(result.id).toBeDefined();

      const savedTransaction = await invoicingTransactionRepository.findOne(result.id);
      expect(savedTransaction).not.toBeNull();
      expect(savedTransaction.referenceId).toBe(dto.reference_id);
    });

    it("should use default payment connector type when it's not set", async () => {
      const dto: CreateInvoicingTransactionInputDTO = {
        reference_id: 'ref123',
        payment_account_id: 'acc456',
        payment_connector_type: null,
        payable_units: 1000,
        payable_currency: 'EGP',
        narration_comment: 'Loan activation',
        transaction_date: new Date(),
      };

      const result = await merchantInvoiceUseCase.createInvoicingRecord(dto);

      expect(result).not.toBeNull();
      expect(result.id).toBeDefined();

      const savedTransaction = await invoicingTransactionRepository.findOne(result.id);
      expect(savedTransaction).not.toBeNull();
      expect(savedTransaction.paymentConnectorType).toBe(PaymentConnectorType.DEFAULT);
    });

    it('should throw an error when required fields are missing', async () => {
      const dto: CreateInvoicingTransactionInputDTO = {
        reference_id: null,
        payment_account_id: 'acc456',
        payment_connector_type: PaymentConnectorType.MS_DYNAMICS,
        payable_units: 1000,
        payable_currency: 'EGP',
        narration_comment: 'Loan activation',
        transaction_date: new Date(),
      };

      await expect(merchantInvoiceUseCase.createInvoicingRecord(dto)).rejects.toThrow();
    });
  });
});