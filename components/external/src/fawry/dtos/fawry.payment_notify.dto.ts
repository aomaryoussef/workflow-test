import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class FawryNotifyRequestDto {
  @ApiProperty({
    description: 'Message code for the request',
    example: 'PmtNotifyRq',
  })
  @IsString()
  msgCode: string;

  @ApiProperty({ description: 'Sender identifier', example: 'FAWRY' })
  @IsString()
  sender: string;

  @ApiProperty({
    description: 'Client date and time in ISO format (Cairo local time)',
    example: DateTime.now().setZone('Africa/Cairo').toISO().split('+')[0],
  })
  @IsString()
  clientDt: string;

  @ApiProperty({
    description: 'Service code for the request',
    example: '70040',
  })
  @IsString()
  serviceCode: string;

  @ApiProperty({
    description: 'Asynchronous request unique identifier',
    example: uuidv4().toString(),
  })
  @IsString()
  asyncRqUID: string;

  @ApiProperty({
    description: 'Billing account number',
    example: '01200000200',
  })
  @IsString()
  billingAcct: string;

  @ApiProperty({
    description: 'Preferred language for the response',
    example: 'ar-eg',
  })
  @IsString()
  language: string;

  @ApiProperty({
    description: 'Indicates if this is a retry request',
    example: false,
  })
  @IsBoolean()
  isRetry: boolean;

  @ApiProperty({
    description: 'Amount related to the transaction or bill',
    example: '100.00',
  })
  @IsNumberString()
  amount: string; // Changed to string to match the JSON example

  @ApiProperty({
    description: 'Payment identifier',
    example: uuidv4().toString(),
  })
  @IsString()
  paymentId: string;

  @ApiProperty({
    description: 'Transaction identifier',
    example: uuidv4().toString(),
  })
  @IsString()
  transactionId: string;

  @ApiProperty({
    description: 'Customer reference number',
    example: '754866979786',
  })
  @IsString()
  customerReferenceNo: string;

  @ApiProperty({
    description: 'Terminal identifier (optional)',
    example: '3404744',
    required: false,
  })
  @IsOptional()
  @IsString()
  terminalId?: string;

  @ApiProperty({
    description: 'Delivery method for the response (optional)',
    example: 'POS',
    required: false,
  })
  @IsOptional()
  @IsString()
  deliveryMethod?: string;

  @ApiProperty({
    description: 'Bank identifier (optional)',
    example: 'FAWRYRTL',
    required: false,
  })
  @IsOptional()
  @IsString()
  bankId?: string;

  @ApiProperty({
    description: 'Bill number associated with the transaction (optional)',
    example: '1234567',
    required: false,
  })
  @IsOptional()
  @IsString()
  billNumber?: string;

  @ApiProperty({
    description: 'Digital signature for verification (optional)',
    example: 'Kp9SENKjwGBF8leKJbsbvhRdl1StaXPu0K9swXfPMDw=',
    required: false,
  })
  @IsOptional()
  @IsString()
  signature?: string;

  constructor() {
    this.msgCode = '';
    this.sender = '';
    this.clientDt = '';
    this.serviceCode = '';
    this.asyncRqUID = '';
    this.billingAcct = '';
    this.language = '';
    this.isRetry = false;
    this.amount = '';
    this.paymentId = '';
    this.transactionId = '';
    this.customerReferenceNo = '';
    this.terminalId = '';
    this.deliveryMethod = '';
    this.bankId = '';
    this.billNumber = '';
    this.signature = '';
  }
}

export class FawryNotifyResponseDto {
  @ApiProperty({
    description: 'Status code of the response, e.g., "200"',
    example: '200',
  })
  statusCode: string;

  @ApiProperty({
    description: 'Description of the status, e.g., "Success"',
    example: 'Success',
  })
  description: string;

  @ApiProperty({
    description: 'Biller Transaction Reference Number from the Biller side',
    example: uuidv4().toString(),
  })
  billerPmtId: string;

  @ApiProperty({
    description: 'Additional information about the bill, optional',
    example:
      'اسم العميل: ايمان ابراهيم محمد;سداد عدد 1 قسط;مبلغ 1 بقيمة 60.00 جنيه;شكرا لاستخدامكم خدمات مايلو للتمويل الاستهلاكي',
    required: false,
  })
  extraBillInfo?: string;

  @ApiProperty({
    description:
      'Digital signature for verification, e.g., statusCode + billerPmtId + security key, then hashed with SHA256 and finally encoded in base64',
    example: 'OgHeqoopyZofJQtMku3+uIaefM==',
  })
  signature: string;

  constructor(data: Partial<FawryNotifyResponseDto>) {
    this.statusCode = data.statusCode || '';
    this.description = data.description || '';
    this.extraBillInfo = data.extraBillInfo;
    this.billerPmtId = data.billerPmtId || '';
    this.signature = data.signature || '';
  }
}
