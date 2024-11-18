import { Injectable } from '@nestjs/common';
export type Partner = { name: string; id: string; category: string ,status: string,branchId: string};
@Injectable()
export class PartnerProvider {
  partner: Partner;
  setValue(partner: Partner) {
    this.partner = partner;
  }
}
