export class MSDynamicsInvoicesRequestDTO {
    public constructor(init?: {
        _request: {
            DataAreaId: string;
            MyloRequestNumber: string;
            IntegrationPoint: string;
            MerchantInvoices: {
                Account: string;
                MerchantInvoiceLines: {
                    CurrencyCode: string;
                    OffsetAccount: string;
                    Description: string;
                    TransDate: string;
                    Amount: number;
                    InvoiceDate: string;
                    InvoiceId: string
                }[]
            }[]
        }
    }) {
        Object.assign(this, init);
    }
    _request: {
        DataAreaId: string;
        IntegrationPoint: string;
        MerchantInvoices: {
            Account: string;
            MerchantInvoiceLines: {
                Amount: number;
                CurrencyCode: string;
                Description: string;
                InvoiceDate: string;
                InvoiceId: string;
                OffsetAccount: string;
                TransDate: string;
            }[];
        }[];
        MyloRequestNumber: string;
    };
}

export class MSDynamicsInvoicesResponseDTO {
    DataAreaId: string;
    IntegrationPoint: string;
    MyloRequestNumber: string;
    MerchantInvoices: {
        Account: string;
        JournalNumber: string;
        HeaderResponseStatus: string;
        HeaderResponseDescription: string;
        MerchantInvoiceLines: {
            OffsetAccount: string;
            Amount: number;
            TransDate: string;
            InvoiceDate: string;
            InvoiceId: string;
            Description: string;
            CurrencyCode: string;
            LineResponseStatus: string;
            LineResponseDescription: string;
        }[];
    }[];
}