import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FawryService } from '~/fawry/fawry.service';
import { HasuraService } from '~/core-services/hasura/hasura.service';
import {
  FawryInquiryRequestDto,
  FawryStatusCode,
} from '~/fawry/dtos/fawry.bill_inquiry.dto';
import {
  RecordNotFoundException,
  InvalidInputException,
} from '~/core-services/hasura/hasura.exceptions';
import { LoggerModule } from '~/core-services/logger/logger.module';
import { FormanceService } from '~/core-services/formance/formance.service';

describe('FawryService', () => {
  let fawryService: FawryService;
  let hasuraService: HasuraService;
  let formanceService: FormanceService;

  const mockHasuraService = {
    getConsumerUpcomingPayment: jest.fn(),
  };

  const mockFormanceService = {
    createPayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule],
      providers: [
        FawryService,
        { provide: FormanceService, useValue: mockFormanceService },
        { provide: HasuraService, useValue: mockHasuraService },
      ],
    }).compile();

    fawryService = module.get<FawryService>(FawryService);
    hasuraService = module.get<HasuraService>(HasuraService);
  });

  it('should return Success when customer loans are found', async () => {
    const request = { billingAcct: '01012345678' } as FawryInquiryRequestDto;

    // Mock hasura service response
    const mockLoans = {
      amount: 100,
      dueDate: '2023-12-31',
      issueDate: '2023-01-01',
      extraInfo: 'schedule IDs: 1,2,3',
    };
    mockHasuraService.getConsumerUpcomingPayment.mockResolvedValue(mockLoans);

    const response = await fawryService.getUpcomingPayment(request);
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('description');
    expect(response.statusCode).toBe(FawryStatusCode.Success);
    expect(response.description).toBe('Success');
    expect(response.amount).toBe('1');
    expect(response.dueDate).toBe(mockLoans.dueDate);
    expect(response.issueDate).toBe(mockLoans.issueDate);
    expect(response.extraBillInfo).toBe(mockLoans.extraInfo);
  });

  it('should return NotFoundAcc when RecordNotFoundException is thrown', async () => {
    const request = { billingAcct: '01012345678' } as FawryInquiryRequestDto;
    mockHasuraService.getConsumerUpcomingPayment.mockRejectedValue(
      new RecordNotFoundException('No consumer found'),
    );
    const response = await fawryService.getUpcomingPayment(request);
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('description');
    expect(response.statusCode).toBe(FawryStatusCode.NotFoundAcc);
  });

  it('should return InvalidAcc when IvalidInputException is thrown', async () => {
    const request = { billingAcct: '01012345678' } as FawryInquiryRequestDto;
    mockHasuraService.getConsumerUpcomingPayment.mockRejectedValue(
      new InvalidInputException('Multiple consumers found'),
    );
    const response = await fawryService.getUpcomingPayment(request);
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('description');
    expect(response.statusCode).toBe(FawryStatusCode.InvalidAcc);
  });

  it('should return Nobill to fawry when hasura service return null', async () => {
    const request = { billingAcct: '01012345678' } as FawryInquiryRequestDto;
    mockHasuraService.getConsumerUpcomingPayment.mockResolvedValue(null);
    const response = await fawryService.getUpcomingPayment(request);
    expect(response).toHaveProperty('statusCode');
    expect(response).toHaveProperty('description');
    expect(response.statusCode).toBe(FawryStatusCode.NoBill);
  });
});
