
export enum EmailTemplate {
    SanctionEmail = 'sanction-email',
    // Add more templates as needed
}
export interface IEmailService {
    sendEmail<T>(
        options: SendEmailOptions<T>
    ): Promise<void>;
}

export interface SendEmailOptions<T> {
    toAddresses: string[];
    ccAddresses?: string[];
    subject: string;
    bodyText?: string; // Optional, as it can be either bodyText or templateName
    templateName?: EmailTemplate; // Optional, as it can be either bodyText or templateName
    placeholders?: T;
}
export interface SanctionEmailBody {
    ReceipientName: string;
    SanctionType: string;
    SanctionedName: string;
    SanctionedSSN: string;
}
