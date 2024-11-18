import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { FawryService } from './fawry.service';
import {
  FawryInquiryRequestDto,
  FawryInquiryResponseDto,
} from './dtos/fawry.bill_inquiry.dto';
import {
  FawryNotifyRequestDto,
  FawryNotifyResponseDto,
} from './dtos/fawry.payment_notify.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBasicAuth,
} from '@nestjs/swagger';

@ApiTags('Payments in by fawry')
@Controller('fawry/api/payments/in')
export class FawryController {
  constructor(private fawryService: FawryService) {}

  @Post('bill-inquiry')
  @HttpCode(200)
  @ApiBody({ type: FawryInquiryRequestDto })
  @ApiOperation({ summary: 'Get upcoming payment' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: FawryInquiryResponseDto,
  })
  @ApiBasicAuth()
  async getUpcomingPayment(
    @Body() request: FawryInquiryRequestDto,
  ): Promise<FawryInquiryResponseDto> {
    const response = await this.fawryService.getUpcomingPayment(request);
    return response;
  }

  @Post('payment-notify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Book payment' })
  @ApiBody({ type: FawryNotifyRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: FawryNotifyResponseDto,
  })
  @ApiBasicAuth()
  async bookPayment(
    @Body() request: FawryNotifyRequestDto,
  ): Promise<FawryNotifyResponseDto> {
    const response = await this.fawryService.bookPayment(request);
    return response;
  }
}
