package apis.partner.partnerPayloads.partnerPayload;
import lombok.*;

@Setter
@Getter
@Data

public class BankAccount {
    private String bank_name;
    private String branch_name;
    private String beneficiary_name;
    private String iban;
    private String swift_code;
    private String account_number;
}
