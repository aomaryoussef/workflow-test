import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
export class FawryInquiryRequestDto {
  @ApiProperty({
    description: 'Message code for the inquiry request',
    example: 'PmtNotifyRq',
  })
  @IsString()
  @IsNotEmpty()
  msgCode: string;

  @ApiProperty({ description: 'Sender identifier', example: 'Fawry' })
  @IsString()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({
    description: 'Client date and time',
    example: '2021-08-25T12:02:22.221',
  })
  @IsString()
  @IsNotEmpty()
  clientDt: string;

  @ApiProperty({
    description: 'Asynchronous request unique identifier',
    example: uuidv4().toString(),
  })
  @IsUUID()
  @IsNotEmpty()
  asyncRqUID: string;

  @ApiProperty({
    description: 'Service code for the inquiry',
    example: '70040',
  })
  @IsString()
  @IsNotEmpty()
  serviceCode: string;

  @ApiProperty({
    description: 'Billing account number',
    example: '01234567891',
  })
  @IsString()
  @IsNotEmpty()
  billingAcct: string;

  @ApiProperty({
    description: 'Preferred language for the response',
    example: 'ar-eg',
  })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({
    description: 'Bank code',
    example: 'FAWRYRTL',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankId?: string;

  @ApiProperty({
    description: 'Delivery method for the response',
    example: 'POS',
    required: false,
  })
  @IsOptional()
  @IsString()
  deliveryMethod?: string;

  @ApiProperty({
    description:
      'Digital signature for the request, serviceCode + billingAcct + extraBillingAcct + securityKey, all hashed with SHA256 and base64 encoded',
    example: 'Kp9SENKjwGBF8leKJbsbvhRdl1StaXPu0K9swXfPMDw=',
    required: false,
  })
  @IsOptional()
  @IsString()
  signature?: string;

  @ApiProperty({
    description: 'Terminal ID',
    example: '3404744',
    required: false,
  })
  @IsOptional()
  @IsString()
  terminalId?: string;

  @ApiProperty({
    description: 'Bill number',
    example: '1234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  billNumber?: string;

  constructor() {
    this.msgCode = '';
    this.sender = '';
    this.clientDt = '';
    this.asyncRqUID = '';
    this.serviceCode = '';
    this.billingAcct = '';
    this.language = '';
    this.bankId = '';
    this.deliveryMethod = '';
    this.signature = '';
  }
}

/**
 * Fawry response status code as perFawr API document. 
  200 - Success
  12011 - Invalid Billing Account (Length or Formatting)
  12006 - Billing Account is not existed
  21012 - Bill not available for payment or no payment dues
  31 - Message Authentication Error.
 */
export enum FawryStatusCode {
  'Success' = '200',
  'InvalidAcc' = '12011',
  'NotFoundAcc' = '12006',
  'NoBill' = '21012',
  'AuthError' = '31',
  'PaymentAmountValidationErro' = '21004',
  'DuplicatePayment' = '21021',
}

export class FawryInquiryResponseDto {
  @ApiProperty({
    description: 'Status code of the transaction or request',
    examples: ['200', '12011', '12006', '21012', '31'],
  })
  @IsNotEmpty()
  statusCode: FawryStatusCode;

  @ApiProperty({
    description: 'Description of the status or transaction',
    examples: [
      'Success',
      'Invalid Billing Account (Length or Formatting)',
      'Billing Account is not existed',
      'Bill not available for payment or no payment dues',
      'Message Authentication Error.',
    ],
  })
  description: string;

  @ApiProperty({
    description: 'Amount related to the transaction or bill',
    examples: ['100.00', '0'],
    required: true,
  })
  amount?: string;

  @ApiProperty({
    description: 'Bill number associated with the transaction',
    example: '1234567',
    required: false,
  })
  billNumber?: string;

  @ApiProperty({
    description: 'Due date for the bill payment in yyyy-MM-dd format',
    example: '2021-08-30',
    required: false,
  })
  dueDate?: string;

  @ApiProperty({
    description: 'Issue date of the bill in yyyy-MM-dd format',
    example: '2021-08-01',
    required: false,
  })
  issueDate?: string;

  @ApiProperty({
    description:
      'Expiration date of the bill or transaction in yyyy-MM-dd format',
    example: '2021-12-31',
    required: false,
  })
  expDate?: string;

  @ApiProperty({
    description: 'Additional information about the bill',
    example: 'Customer Name; Address',
    required: false,
  })
  extraBillInfo?: string;

  @ApiProperty({
    description:
      'Digital signature for verification, statusCode + amount + securitykey, all hashed with SHA256 and base64 encoded',
    example: 'Kp9SENKjwGBF8leKJbsbvhRdl1StaXPu0K9swXfPMDw=',
    required: false,
  })
  signature: string;

  constructor(data: FawryInquiryResponseDto) {
    this.statusCode = data.statusCode;
    this.description = data.description || '';
    this.amount = data.amount || '';
    this.billNumber = data.billNumber || '';
    this.dueDate = data.dueDate || '';
    this.issueDate = data.issueDate || '';
    this.expDate = data.expDate || '';
    this.extraBillInfo = data.extraBillInfo || '';
    this.signature = data.signature || '';
  }
}
