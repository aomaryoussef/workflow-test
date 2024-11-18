import { ConfigModule } from '@nestjs/config';
import { HasuraService } from './hasura.service';
import { Test } from '@nestjs/testing';
import { LoggerModule } from '../logger/logger.module';

describe('HasuraService', () => {
  let hasuraService: HasuraService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, LoggerModule],
      providers: [HasuraService],
    }).compile();
    hasuraService = moduleRef.get<HasuraService>(HasuraService);
  });

  it('should aggregate and sort loan schedules by due date', () => {
    const loans = [
      {
        loan_schedules: [
          {
            id: 1,
            paid_date: null,
            created_at: '2024-02-19T19:37:39.752884+00:00',
            due_principal: 1000,
            due_date: '2024-06-19T00:00:00+00:00',
          },
          {
            id: 2,
            paid_date: null,
            created_at: '2024-02-20T19:37:39.752884+00:00',
            due_principal: 2000,
            due_date: '2024-06-19T00:00:00+00:00',
          },
        ],
      },
      {
        loan_schedules: [
          {
            id: 3,
            paid_date: null,
            created_at: '2024-02-21T19:37:39.752884+00:00',
            due_principal: 3000,
            due_date: '2024-07-19T00:00:00+00:00',
          },
        ],
      },
      {
        loan_schedules: [
          // This is a pad loan schedule, so it shoiuld not be included in the result
          {
            id: 4,
            paid_date: '2024-05-19T00:00:00+00:00',
            created_at: '2024-02-22T19:37:39.752884+00:00',
            due_principal: 4000,
            due_date: '2024-05-19T00:00:00+00:00',
          },
        ],
      },
    ];

    const expectedOutput = [
      [
        {
          id: 1,
          paid_date: null,
          created_at: '2024-02-19T19:37:39.752884+00:00',
          due_principal: 1000,
          due_date: '2024-06-19T00:00:00+00:00',
        },
        {
          id: 2,
          paid_date: null,
          created_at: '2024-02-20T19:37:39.752884+00:00',
          due_principal: 2000,
          due_date: '2024-06-19T00:00:00+00:00',
        },
      ],
      [
        {
          id: 3,
          paid_date: null,
          created_at: '2024-02-21T19:37:39.752884+00:00',
          due_principal: 3000,
          due_date: '2024-07-19T00:00:00+00:00',
        },
      ],
    ];

    const result = hasuraService.aggregateLoanSchedulesPerDueDate(loans);
    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty array if there are no unpaid loans', () => {
    const loans = [
      {
        loan_schedules: [
          {
            id: 1,
            paid_date: '2024-02-19T19:37:39.752884+00:00',
            created_at: '2024-02-19T19:37:39.752884+00:00',
            due_principal: 1000,
            due_date: '2024-06-19T00:00:00+00:00',
          },
          {
            id: 2,
            paid_date: '2024-02-20T19:37:39.752884+00:00',
            created_at: '2024-02-20T19:37:39.752884+00:00',
            due_principal: 2000,
            due_date: '2024-06-19T00:00:00+00:00',
          },
        ],
      },
    ];

    const expectedOutput = [];

    const result = hasuraService.aggregateLoanSchedulesPerDueDate(loans);
    expect(result).toEqual(expectedOutput);
  });
});
