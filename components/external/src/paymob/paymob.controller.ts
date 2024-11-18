import {
  Body,
  Controller,
  Param,
  HttpCode,
  Post,
  HttpStatus
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiExtraModels,
  ApiResponse,
  ApiBody,
  ApiBasicAuth,
} from '@nestjs/swagger';
import { PaymobService } from './paymob.service';
import {
  StartCheckoutRequestDto,
  StartCheckoutResponseDto,
} from './dtos/paymob.start-checkout.dto';
import { PaymobBaseResponseDto } from './dtos/paymob.base-response.dto';
import {
  SelectInstallmentsPlanRequestDto,
  SelectInstallmentsPlanResponseDto,
} from './dtos/paymob.select-installment-plan.dto';
import { ResendOTPRequestDto } from './dtos/paymob.resend-otp.dto';
import { RefundResponseDto } from './dtos/paymob-refund.dto';
import { CancelCheckoutResponseDto } from './dtos/paymob.cancel-checkout.dto';
import {
  ReceiptDataDto,
  VerifyAndConfirmRequestDto,
  VerifyAndConfirmResponseDto,
} from './dtos/paymob.verify-and-confirm.dto';

@ApiTags('Checkouts by Paymob')
@Controller('paymob/api/checkout')
@ApiBasicAuth()
export class PaymobController {
  constructor(private paymobService: PaymobService) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: StartCheckoutRequestDto })
  @ApiOperation({ summary: 'start checkout' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: PaymobBaseResponseDto<StartCheckoutResponseDto>,
  })
  @ApiExtraModels(PaymobBaseResponseDto, StartCheckoutResponseDto)
  async startCheckout(
    @Body() request: StartCheckoutRequestDto,
  ): Promise<PaymobBaseResponseDto<StartCheckoutResponseDto>> {
    const response = await this.paymobService.startCheckout(
      request.phone_number,
      request.product_price,
      request.product_name,
      request.down_payment,
      request.terminal_id,
      request.merchant_id,
    );
    return response;
  }

  @Post('/:transaction_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Select installments plan' })
  @ApiBody({ type: SelectInstallmentsPlanRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful Response',
    type: PaymobBaseResponseDto<SelectInstallmentsPlanResponseDto>,
  })
  @ApiExtraModels(SelectInstallmentsPlanResponseDto)
  async selectInstallmentsPlan(
    @Param('transaction_id') transactionId: bigint,
    @Body() request: SelectInstallmentsPlanRequestDto,
  ): Promise<PaymobBaseResponseDto<SelectInstallmentsPlanResponseDto>> {
    return await this.paymobService.selectInstallmentsPlan(
      transactionId,
      request.selected_installment,
    );
  }

  @Post('/:transaction_id/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify OTP , confirm transaction and print receipt',
  })
  @ApiBody({ type: VerifyAndConfirmRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Successful Response',
    type: PaymobBaseResponseDto<VerifyAndConfirmResponseDto>,
  })
  @ApiExtraModels(PaymobBaseResponseDto, VerifyAndConfirmResponseDto)
  async confirmAndPrintReceipt(
    @Param('transaction_id') transactionId: bigint,
    @Body() request: VerifyAndConfirmRequestDto,
  ): Promise<PaymobBaseResponseDto<VerifyAndConfirmResponseDto>> {
    return this.paymobService.verifyAndConfirm(transactionId, request);
  }

  @Post('/:transaction_id/inquiry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'inquiry' })
  @ApiResponse({
    status: 200,
    description: 'Successful Response',
    type: PaymobBaseResponseDto,
  })
  @ApiExtraModels(PaymobBaseResponseDto)
  async inquiryCheckout(
    @Param('transaction_id') transactionId: bigint,
  ): Promise<PaymobBaseResponseDto<ReceiptDataDto>> {
    const response = await this.paymobService.inquiryCheckout(transactionId);

    return response;
  }

  @Post('/:transaction_id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel checkout' })
  @ApiResponse({
    status: 200,
    description: 'Successful Response',
    type: PaymobBaseResponseDto,
  })
  @ApiExtraModels(PaymobBaseResponseDto)
  async cancelCheckout(
    @Param('transaction_id') transactionId: bigint,
  ): Promise<PaymobBaseResponseDto<CancelCheckoutResponseDto>> {
    const response = await this.paymobService.cancelCheckout(transactionId);
    return response;
  }

  @Post('/:transaction_id/otp/resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend OTP' })
  @ApiBody({ type: ResendOTPRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Successful Response',
    type: PaymobBaseResponseDto,
  })
  @ApiExtraModels(PaymobBaseResponseDto)
  async resendOtp(
    @Param('transaction_id') transactionId: bigint,
    @Body() request: ResendOTPRequestDto,
  ): Promise<PaymobBaseResponseDto<any>> {
    const response = await this.paymobService.resendOTP(
      transactionId,
      request.method,
    );
    return response;
  }

  @Post('/:transaction_id/refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get receipt data' })
  @ApiResponse({
    status: 200,
    description: 'Successful Response',
    type: PaymobBaseResponseDto,
  })
  @ApiExtraModels(PaymobBaseResponseDto)
  async refund(
    @Param('transaction_id') transactionId: bigint,
  ): Promise<PaymobBaseResponseDto<RefundResponseDto>> {
    const response = this.paymobService.refund(transactionId);
    return response;
  }
}
