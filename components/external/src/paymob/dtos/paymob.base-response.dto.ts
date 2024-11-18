import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: null, description: 'Error code' })
  code: string | null;

  @ApiProperty({ example: null, description: 'Error message in English' })
  message_en: string | null;

  @ApiProperty({ example: null, description: 'Error message in Arabic' })
  message_ar: string | null;

  constructor(code: string | null) {
    this.code = code;
    const message = ErrorResponseDto.getMessage(code);
    if (message) {
      this.message_en = message['en'];
      this.message_ar = message['ar'];
    }
  }
  // Static method to get error messages based on status code
  private static getMessage(code: string | null): object | null {
    const messages: { [key: string]: { en: string; ar: string } } = {
      [PaymobErrorStatusCode.NotAMyloUserOrPendingActivation]: {
        en: 'Not a Mylo user or pending activation',
        ar: 'ليس مستخدمًا في مايلو أو في انتظار التفعيل',
      },
      [PaymobErrorStatusCode.InsufficientCreditLimit]: {
        en: 'Insufficient credit limit',
        ar: 'حد الائتمان غير كافٍ',
      },
      [PaymobErrorStatusCode.CheckoutFailed]: {
        en: 'Checkout failed',
        ar: 'فشل في العملية',
      },
      [PaymobErrorStatusCode.InvalidAmountToBeFinanced]: {
        en: 'Invalid amount to be financed',
        ar: 'المبلغ الممول غير صالح',
      },
      [PaymobErrorStatusCode.InvalidMobileNumber]: {
        en: 'Invalid mobile number',
        ar: 'رقم الهاتف المحمول غير صالح',
      },
      [PaymobErrorStatusCode.InvalidTransactionId]: {
        en: 'Invalid transaction ID',
        ar: 'معرّف المعاملة غير صالح',
      },
      [PaymobErrorStatusCode.CouldNotSelectPlan]: {
        en: 'Could not select plan',
        ar: 'تعذر اختيارالخطه',
      },
      [PaymobErrorStatusCode.InvalidOTP]: {
        en: 'Invalid OTP',
        ar: 'الكود غير صالح',
      },
      [PaymobErrorStatusCode.CouldNotConfirmCheckout]: {
        en: 'Could not confirm checkout',
        ar: 'تعذر تأكيد الدفع',
      },
      [PaymobErrorStatusCode.CouldNotGetSelectedPlan]: {
        en: 'Could not get selected plan',
        ar: 'تعذر الحصول على الخطة المختارة',
      },
      [PaymobErrorStatusCode.DuplicateTransactionId]: {
        en: 'Duplicate paymob transaction ID Please resend OTP and reconfirm checkout',
        ar: 'معرّف المعاملة مكرر يرجى إعادة إرسال الكود وإعادة تأكيد الدفع',
      },
      [PaymobErrorStatusCode.CouldNotCancelCheckout]: {
        en: 'Could not cancel checkout',
        ar: 'تعذر إلغاء الدفع',
      },
      [PaymobErrorStatusCode.LoanWasProcessedAndCanNotBeCancelled]: {
        en: 'Loan was processed and cannot be cancelled',
        ar: 'تم معالجة القرض ولا يمكن إلغاؤه',
      },
      [PaymobErrorStatusCode.CouldNotResendOTP]: {
        en: 'Could not resend OTP',
        ar: 'تعذر إعادة إرسال الكود',
      },
      [PaymobErrorStatusCode.ProductCannotBeReturned]: {
        en: 'Product cannot be returned',
        ar: 'لا يمكن إرجاع المنتج',
      },
      [PaymobErrorStatusCode.CouldNotInquiryCheckout]: {
        en: 'Could not inquiry checkout',
        ar: 'تعذر الاستعلام عن الدفع',
      },
      [PaymobErrorStatusCode.CouldNotProcessProductReturn]: {
        en: 'Could not process product return',
        ar: 'تعذر معالجة إرجاع المنتج',
      },
      [PaymobErrorStatusCode.InvalidClientCredentials]: {
        en: 'Invalid client credentials',
        ar: 'بيانات اعتماد العميل غير صالحة',
      },
    };

    return code && messages[code] ? messages[code] : null;
  }
}

export class PaymobBaseResponseDto<T> {
  @ApiProperty({ type: ErrorResponseDto, description: 'Error object' })
  error: ErrorResponseDto;

  @ApiProperty({ description: 'Response data' })
  data: T;
  constructor() {
    this.data = new Object() as T;
  }
}

export enum PaymobErrorStatusCode {
  //StartCheckout
  NotAMyloUserOrPendingActivation = '1001',
  InsufficientCreditLimit = '1002',
  CheckoutFailed = '1003',
  InvalidAmountToBeFinanced = '1004',
  InvalidMobileNumber = '1005',
  //SelectInstallmentsPlan
  InvalidTransactionId = '2001',
  CouldNotSelectPlan = '2002',
  //VerifyOtp
  InvalidOTP = '3001',
  CouldNotConfirmCheckout = '3002',
  CouldNotGetSelectedPlan = '3003',
  DuplicateTransactionId = '3004', //
  //CancelCheckout
  CouldNotCancelCheckout = '4001',
  LoanWasProcessedAndCanNotBeCancelled = '4002',
  //ResendOtp
  CouldNotResendOTP = '5001',
  //InquiryCheckout
  CouldNotInquiryCheckout = '6005',
  //refund
  ProductCannotBeReturned = '7001',
  CouldNotProcessProductReturn = '7002',
  //hydra auth
  InvalidClientCredentials = '9001',
}
