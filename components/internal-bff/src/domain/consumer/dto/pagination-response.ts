import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  totalCount: number;
}
