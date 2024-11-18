package apis.partner.partnerPayloads.partnerPayload;
import lombok.*;

import java.util.List;

@Setter
@Getter
@Data
public class Partner {
    private String name;
    private List<String> categories;
    private String tax_registration_number;
    private String commercial_registration_number;
    private Admin admin_user_profile;
    private BranchDetails branch;
    private BankAccount bank_account;
    private ResetPassword resetPassword;
}