import { Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import csv from 'csv-parser';
import { SanctionList } from '../models/sanction-list.entity';
import path from 'path';
import { SanctionListRepository } from '../repository/sanction-list.repository';
import { makeArabicTextSearchable } from 'src/utils/arabic-text.utils';
import { CustomLoggerService } from 'src/common/services/logger.service';
import { LoggerFactory } from 'src/types/logger.interface';
import { SanctionType, SanctionTypeArabicText } from '../types/sanction-list.types';
import { EmailService } from 'src/services/email/email.service';
import { EmailTemplate, SanctionEmailBody } from 'src/services/email/types/email.types';
import { settings } from 'config/settings';
import { NotifySanctionListDto } from '../dto/api/sancation-list.dto';
@Injectable()
export class SanctionListUseCase {
    private readonly logger: CustomLoggerService;

    constructor(
        private readonly sanctionListRepository: SanctionListRepository,
        private readonly emailService: EmailService,
        @Inject('CUSTOM_LOGGER') private readonly loggerFactory: LoggerFactory,

    ) {
        this.logger = this.loggerFactory(SanctionListUseCase.name);
    }

    // Search for a sanction by name or national_id
    async searchSanction(name: string, national_id: string): Promise<SanctionList> {
        try {
            const sanitizedName = makeArabicTextSearchable(name);
            this.logger.log(`Searching for sanctions with name: ${sanitizedName} and SSN: ${national_id}`);
            const user = await this.sanctionListRepository.findOneByNameOrSsn(sanitizedName, national_id);
            if (user) {
                this.logger.log(`Found sanction with name: ${sanitizedName} and SSN: ${national_id}`);
                this.notifySanction({ originalName: user.originalName, nationalId: user.nationalId, sanctionType: user.sanctionType });
                return user
            }
            return null
        } catch (error) {
            this.logger.error({ message: `An error occurred while searching for sanction with name: ${name} or SSN: ${national_id}`, error });
            throw error;
        }
    }

    async notifySanction(user: NotifySanctionListDto): Promise<void> {
        try {
            this.emailService.sendEmail<SanctionEmailBody>({
                toAddresses: settings.sanctionEmail.sanctionMailTo.split(','),
                ccAddresses: settings.sanctionEmail.sanctionMailCc.split(','),
                subject: `عميل مدرج في قوائم ${user.sanctionType || ''}`,
                templateName: EmailTemplate.SanctionEmail,
                placeholders: {
                    ReceipientName: settings.sanctionEmail.sanctionMailReceipientName,
                    SanctionedName: user.originalName,
                    SanctionedSSN: user.nationalId,
                    SanctionType: SanctionTypeArabicText[user.sanctionType],
                }
            });

            this.logger.log(`Sanction notification sent for user with name: ${user.originalName} 
                and national_id: ${user.nationalId} on list type: ${user.sanctionType}`);
        } catch (error) {
            this.logger.error({ message: 'Failed to send sanction notification email:', error });
            throw error;
        }
    }
    // Import CSV and upsert sanctions into the database
    async importAndUpsertSanctions(): Promise<void> {
        try {
            this.logger.log('Starting the import and upsert of sanction lists.');
            const sanctions = await this.importCsv('sanctions-list.csv', SanctionType.SanctionsList);
            const terrorists = await this.importCsv('terrorists-list.csv', SanctionType.TerroristsList);

            // Combine both datasets and upsert
            await this.sanctionListRepository.upsertSanctions([...sanctions, ...terrorists]);
            this.logger.log('Import and upsert of sanction lists completed successfully.');
        } catch (error) {
            this.logger.error({ message: 'An error occurred while importing and upserting sanction lists.', error });
        }
    }
    // Helper method to read and sanitize data from CSV files
    private async importCsv(fileName: string, sanctionType: SanctionType): Promise<SanctionList[]> {
        return new Promise((resolve, reject) => {
            const sanctions: SanctionList[] = [];
            const seenSSNs = new Set<string>();
            const filePath = path.join(__dirname, '../../../../assets/csv/sanctions-lists', fileName);

            this.logger.log(`Reading CSV file from path: ${filePath}`);

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    try {
                        const originalName = row?.['Name'];
                        const otherName = row?.['OtherName'];
                        const ssn = row?.['SSN'] || null;

                        // Validate Name
                        if (!originalName) {
                            this.logger.warn(`Skipping row with missing name: ${JSON.stringify(row)}`);
                            return;
                        }

                        // Validate SSN if provided
                        if (ssn && !/^\d{14}$/.test(ssn)) {
                            this.logger.warn(`Skipping row with invalid SSN: ${ssn}`);
                            return;
                        }

                        // Check for duplicate SSN if provided
                        if (ssn && seenSSNs.has(ssn)) {
                            this.logger.warn(`Skipping duplicate SSN: ${ssn}`);
                            return;
                        }
                        if (ssn) seenSSNs.add(ssn);
                        const searchableText = makeArabicTextSearchable(originalName);

                        const originalNameEntry = new SanctionList();
                        originalNameEntry.originalName = originalName;
                        originalNameEntry.searchableText = searchableText;
                        originalNameEntry.nationalId = ssn;
                        originalNameEntry.sanctionType = sanctionType; // Use the enum value
                        sanctions.push(originalNameEntry);
                        if (otherName) {
                            const searchableOtherName = makeArabicTextSearchable(otherName);
                            if (!searchableOtherName) {
                                this.logger.warn(`Skipping row with invalid other name: ${otherName}`);
                                return;
                            }
                            const otherNameEntry = new SanctionList();
                            otherNameEntry.originalName = otherName;
                            otherNameEntry.searchableText = searchableOtherName;
                            otherNameEntry.nationalId = ssn;
                            otherNameEntry.sanctionType = sanctionType; // Use the enum value for other name
                            sanctions.push(otherNameEntry);
                        }
                    } catch (error) {
                        this.logger.error({ message: `Error processing row in file: ${fileName}`, error });
                    }
                })
                .on('end', () => {
                    this.logger.log(`Finished reading CSV file: ${fileName}`);
                    resolve(sanctions);
                })
                .on('error', (error) => {
                    this.logger.error({ message: `Error reading CSV file: ${fileName}`, error });
                    reject(error);
                });
        });
    }
}
