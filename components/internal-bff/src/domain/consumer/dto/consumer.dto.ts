import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsInt,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class OnboardConsumerInputDto {
  @ApiProperty({
    example: '+201234567891',
    description: 'Consumer phone number with country code',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class OnboardConsumerOutputDto {
  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  success: true;
}

export class VerifyOnboardingOtpStepInputDto {
  @ApiProperty({
    example: '+201234567891',
    description: 'Consumer phone number with country code',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'OTP_VALIDATION_SUCCESS',
    description: 'Consumer phone number with country code',
  })
  @IsString()
  step: string = 'OTP_VALIDATION_SUCCESS';
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
}

export class CreateConsumerProfileInputDto {
  @ApiProperty({ description: 'First name of the consumer' })
  @IsString()
  first_name: string;

  @ApiPropertyOptional({ description: 'Middle name of the consumer' })
  @IsOptional()
  @IsString()
  middle_name?: string;

  @ApiProperty({ description: 'Last name of the consumer' })
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'Job type of the consumer' })
  @IsString()
  job_type: string;

  @ApiProperty({ description: 'Job title of the consumer' })
  @IsString()
  job_title: string;

  @ApiProperty({ description: 'Company name where the consumer works' })
  @IsString()
  company_name: string;

  @ApiProperty({ description: 'Type of house the consumer resides in' })
  @IsString()
  house_type: string;

  @ApiProperty({ description: 'Marital status of the consumer' })
  @IsEnum(MaritalStatus)
  marital_status: MaritalStatus;

  @ApiProperty({ description: "Model of the consumer's car" })
  @IsOptional()
  @IsString()
  car_model: string;

  @ApiProperty({ description: "Year of the consumer's car model" })
  @IsOptional()
  car_year: number;

  @ApiProperty({ description: 'Primary income of the consumer', type: Number })
  @IsNumber()
  primary_income: number;

  @ApiProperty({ description: 'Governorate ID where the consumer lives' })
  @IsInt()
  governorate_id: number;

  @ApiProperty({ description: 'City ID where the consumer lives' })
  @IsInt()
  city_id: number;

  @ApiProperty({ description: 'Area ID where the consumer lives' })
  @IsInt()
  @IsOptional()
  area_id: number;

  @ApiProperty({ description: "Consumer's address" })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ description: "Consumer's club membership" })
  @IsOptional()
  @IsString()
  club: string;

  @ApiPropertyOptional({
    description: 'Number of kids the consumer has',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value || 0)
  number_of_kids?: number;

  @ApiProperty({ description: 'National ID of the consumer' })
  @IsString()
  national_id: string;

  @ApiProperty({ description: 'National ID of the consumer' })
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiProperty({ description: 'Email of the consumer' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateConsumerProfileInputData {
  constructor();
  constructor(data: CreateConsumerProfileInputDto);
  constructor(data?: CreateConsumerProfileInputDto) {
    this.firstName = data.first_name;
    this.middleName = data.middle_name;
    this.lastName = data.last_name;
    this.jobType = data.job_type;
    this.jobTitle = data.job_title;
    this.companyName = data.company_name;
    this.houseType = data.house_type;
    this.maritalStatus = data.marital_status;
    this.carModel = data.car_model;
    this.carYear = data.car_year;
    this.primaryIncome = data.primary_income;
    this.governorateId = data.governorate_id;
    this.cityId = data.city_id;
    this.areaId = data.area_id;
    this.address = data.address;
    this.club = data.club;
    this.numberOfKids = data.number_of_kids;
    this.nationalId = data.national_id;
    this.email = data.email;
  }

  firstName: string;
  middleName?: string;
  lastName: string;
  jobType: string;
  jobTitle: string;
  companyName: string;
  houseType: string;
  maritalStatus: string;
  carModel?: string;
  carYear?: number;
  primaryIncome: number;
  governorateId: number;
  cityId: number;
  areaId?: number;
  address?: string;
  club: string;
  numberOfKids?: number;
  nationalId: string;
  email?: string;
}

export interface CarModelDto {
  name: string;
  id: number;
  uniqueIdentifier: string;
}

export interface ConsumerDataDto {
  data: {
    id: string;
    iam_id: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    credit_limit: number;
    status: string;
  };
}

export interface CategoryDto {
  slug: string;
  name: string;
  icon: string;
}

export const categories: Record<
  string,
  { slug: string; enName: string; arName: string; icon: string }
> = {
  ALL: {
    slug: 'ALL',
    enName: 'All',
    arName: 'الكل',
    icon: '',
  },
  ELECTRONICS: {
    slug: 'ELECTRONICS',
    enName: 'Home Appliances',
    arName: 'أجهزة منزلية',
    icon: 'electronics.svg',
  },
  FASHION: {
    slug: 'FASHION',
    enName: 'Fashion',
    arName: 'أزياء وملابس',
    icon: 'fashion.svg',
  },
  FURNITURE: {
    slug: 'FURNITURE',
    enName: 'Furniture',
    arName: 'أثاث وديكور',
    icon: 'furniture.svg',
  },
  FINISHING: {
    slug: 'FINISHING',
    enName: 'Finishing',
    arName: 'تشطيبات',
    icon: 'finishing.svg',
  },
  HOME_WARE: {
    slug: 'HOME_WARE',
    enName: 'Home ware',
    arName: 'أدوات منزلية',
    icon: 'homeware.svg',
  },
  CERAMICS_AND_SANITARY_WARE: {
    slug: 'CERAMICS_AND_SANITARY_WARE',
    enName: 'Ceramics & sanitary ware',
    arName: 'سيراميك وأدوات صحية',
    icon: 'ceramics.svg',
  },
  AUTO_SPARE_PARTS: {
    slug: 'AUTO_SPARE_PARTS',
    enName: 'Auto spare parts',
    arName: 'قطع غيار سيارات',
    icon: 'automotive.svg',
  },
  BABY_AND_TOYS: {
    slug: 'BABY_AND_TOYS',
    enName: 'Baby & toys',
    arName: 'أطفال وألعاب',
    icon: 'kids.svg',
  },
  JEWELRY: {
    slug: 'JEWELRY',
    enName: 'Jewelry',
    arName: 'مجوهرات',
    icon: 'jewelry.svg',
  },
  SUPERMARKETS: {
    slug: 'SUPERMARKETS',
    enName: 'Supermarkets',
    arName: 'بقالة وسوبر ماركت',
    icon: 'grocery.svg',
  },
  EVENT_PLANNING: {
    slug: 'EVENT_PLANNING',
    enName: 'Event planning',
    arName: 'أفراح ومناسبات',
    icon: 'events.svg',
  },
  EDUCATION: {
    slug: 'EDUCATION',
    enName: 'Education',
    arName: 'تعليم',
    icon: 'school.svg',
  },
  MOTORCYCLES: {
    slug: 'MOTORCYCLES',
    enName: 'Motorcycles',
    arName: 'موتوسيكلات',
    icon: 'motorcycle.svg',
  },
  TOURISM_AND_ENTERTAINMENT: {
    slug: 'TOURISM_AND_ENTERTAINMENT',
    enName: 'Tourism & Entertainment',
    arName: 'سياحة و ترفيه',
    icon: 'tourism.svg',
  },
  MEDICAL: {
    slug: 'MEDICAL',
    enName: 'Medical',
    arName: 'خدمات طبية',
    icon: 'medical.svg',
  },
  ACCESSORIES: {
    slug: 'ACCESSORIES',
    enName: 'Accessories',
    arName: 'إكسسوارات',
    icon: 'accessories.svg',
  },
  WEDDING_HALLS: {
    slug: 'WEDDING_HALLS',
    enName: 'Wedding Halls',
    arName: 'قاعات أفراح',
    icon: 'weddinghalls.svg',
  },
  OPTICS: {
    slug: 'OPTICS',
    enName: 'Optics',
    arName: 'بصريات',
    icon: 'optics.svg',
  },
  SPORTS: {
    slug: 'SPORTS',
    enName: 'Sports',
    arName: 'رياضة',
    icon: 'sports.svg',
  },
  MOBILE: {
    slug: 'MOBILE',
    enName: 'Mobile & Electronics',
    arName: 'موبايلات والكترونيات',
    icon: 'mobile.svg',
  },
  SHOPPING_HUBS: {
    slug: 'SHOPPING_HUBS',
    enName: 'Shopping Hubs',
    arName: 'مراكز تسوق',
    icon: 'hubs.svg',
  },
};

export class PartnerDto {
  @ApiProperty({
    description: 'The unique identifier of the partner',
    example: '0285b859-a961-4e90-9c04-708e139469e8',
  })
  id: string;

  @ApiProperty({
    description: 'The name of the partner',
    example: '2 الشركة العربية المتحدة',
  })
  name: string;

  @ApiProperty({
    description: 'Categories associated with the partner',
    example: ['ELECTRONICS'],
  })
  categories: CategoryDto[];
}

export class LoanDto {
  @ApiProperty({
    description: 'The unique identifier of the loan',
    example: '29ace60f-67bf-4489-90b6-7af621a4c125',
  })
  id: string;

  @ApiProperty({
    description: 'The total amount of the loan in cents',
    example: '100000',
  })
  total_amount: number;

  @ApiProperty({
    description: 'The loan status',
    example: 'ACTIVE',
  })
  status: string;

  @ApiProperty({
    description: 'The booking date and time of the loan',
    example: '2024-04-12T13:44:37.932978+00:00',
  })
  booked_at: string;

  @ApiProperty({
    description: 'Partner name',
  })
  partner_name: string;

  @ApiProperty({
    description: "Partner's category icons",
  })
  category_icon: string;
}

export class ConsumerLoansResponseDto {
  @ApiProperty({ description: 'An object containing loan data' })
  loans: LoanDto[];
}
