import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../common/repository/base.repository';
import { SanctionList } from '../models/sanction-list.entity';

@Injectable()
export class SanctionListRepository extends BaseRepository<SanctionList> {
  constructor(
    @InjectRepository(SanctionList)
    private readonly sanctionListRepository: Repository<SanctionList>,
  ) {
    super(sanctionListRepository);

  }

  async upsertSanctions(sanctions: SanctionList[]): Promise<void> {
    await this.sanctionListRepository.delete({})
    await this.sanctionListRepository
      .createQueryBuilder()
      .insert()
      .into(SanctionList)
      .values(sanctions)
      .orIgnore()
      .execute()
  }

  // Search sanctions by sanitized name or SSN
  async findOneByNameOrSsn(searchableText: string, ssn: string): Promise<SanctionList> {
    const query = this.sanctionListRepository
      .createQueryBuilder('sanction');
    const conditions = [];
    const parameters: Record<string, any> = {};
    if (searchableText) {
      conditions.push('sanction.searchableText = :searchableText');
      parameters.searchableText = searchableText;
    }
    if (ssn) {
      conditions.push('sanction.nationalId = :ssn');
      parameters.ssn = ssn;
    }
    if (conditions.length) {
      query.where(conditions.join(' OR '), parameters);
    }
    return query.getOne();
  }
}
