package apis.partner.partnerPayloads.partnerPayload;
import lombok.*;

@Setter
@Getter
@Data
public class BranchDetails {
    private String governorate;
    private String city;
    private String area;
    private String street;
    private Location location;
}
