import { StartWorkflowRequest } from '@io-orkes/conductor-javascript';
import { Inject, Injectable } from '@nestjs/common';
import { json } from 'stream/consumers';
import { HasuraService } from '~/core-services/hasura/hasura.service';
import { CustomLoggerService } from '~/core-services/logger/logger.service';
import { LoggerFactory } from '~/core-services/logger/types';
import { WorkflowService } from '~/core-services/workflow/workflow.service';
export class GetLoanDetailsResponseDto {
  data: {
    loan: {
      booked_at: string; 
      loan_schedules: {
        id: number;
        paid_date: string; 
      }[];
    }[];
  };
}
export const getLoanDetailsQuery = `
query getLoanDetails($loanId: String!) {
  loan(where: {id: {_eq: $loanId}}) {
    booked_at
    loan_schedules(where: {paid_date: {_is_null: false}}) {
      id
      paid_date
    }
  }
}
`;
@Injectable()
export class LoanRepository {
  private readonly logger: CustomLoggerService;

  constructor(
    private readonly workflowService: WorkflowService,
    private readonly hasuraService: HasuraService,
    @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory('paymob loan repository');
  }

  
  async getLoanDetails(
    loanId: string,
  ): Promise<{ bookedDate: string; numberOfPayedInstallments: number }> {
    this.logger.debug(`getLoanDetails called with loanId: ${loanId}`);
    try {
      const result =
        await this.hasuraService.executeQuery<GetLoanDetailsResponseDto>(
          getLoanDetailsQuery,
          { loanId },
        );
      const loans = result.data.loan;
      if (loans.length === 0) {
        return null;
      }
      const loan = loans[0];
      return { bookedDate: loan.booked_at, numberOfPayedInstallments: loan.loan_schedules.length};
    } catch (error) {
      this.logger.error('Error fetching loan details:' + error);
      throw new Error('Unable to fetch loan details');
    }
}

  async cancelLoan(
    loanId: string,consumerId: string,partnerId: string
  ): Promise<boolean> {
    this.logger.debug('Start cancelling loan:'+ loanId);
    try {
      const workflowRequest: StartWorkflowRequest = {
        name: "cancel_loan",
        correlationId: loanId,
        input: {
          cancel_loan_details: {
            reference_id: "123",
            loan_id: loanId,
            consumer_id: consumerId,
            merchant_id: partnerId,
            cancellation_time: new Date().toISOString(),
            reason: "PRODUCT_RETURN",
          },
        },
    };
    const workflowId = await this.workflowService.startWorkflow(workflowRequest);
    const status=  await this.workflowService.waitForWorkflowCompletion(workflowId);
         this.logger.log('Workflow status:'+ status);
         if(status === 'COMPLETED'){
           return true;
         }
         else{
              return false;
            }
    }
     catch (error) {
      this.logger.error('Error cancelling loan:' + error);
     return false;
    }
  }
}
