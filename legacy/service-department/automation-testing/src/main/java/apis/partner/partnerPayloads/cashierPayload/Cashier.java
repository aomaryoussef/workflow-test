package apis.partner.partnerPayloads.cashierPayload;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Data

public class Cashier {

        private String first_name;
        private String last_name;
        private String email;
        private String phone_number;
        private String national_id;

}
