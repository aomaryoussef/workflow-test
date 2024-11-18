import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomLoggerService } from "src/common/services/logger.service";
import { ConsumerState } from "../models/consumer-state.entity";
import { BaseRepository } from '../../common/repository/base.repository';
import { LoggerFactory } from "src/types/logger.interface";
import { ConsumerRepository } from "./consumer.repository";
import { Repository } from 'typeorm';

@Injectable()
export class ConsumerStateRepository extends BaseRepository<ConsumerState> {
    private readonly logger: CustomLoggerService; // Logger for the service

    constructor(
        @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,

        @InjectRepository(ConsumerState)
        private readonly consumerStateRepository: Repository<ConsumerState>,
    ) {
        super(consumerStateRepository);
        this.logger = this.loggerFactory(ConsumerRepository.name);
    }
}