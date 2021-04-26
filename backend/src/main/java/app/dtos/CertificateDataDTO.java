package app.dtos;


import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificateDataDTO {
    @Pattern(regexp = "^[a-zA-Z 0-9,.'-]+$",  message = "Bad pattern")
    private String issuerAlias;
    @Pattern(regexp = "^[a-zA-Z 0-9,.'-]+$",  message = "Bad pattern")
    private String cn;
    @Pattern(regexp = "^[a-zA-Z 0-9,.'-]+$",  message = "Bad pattern")
    private String surname;
    @Pattern(regexp = "^[a-zA-Z 0-9,.'-]+$",  message = "Bad pattern")
    private String givenName;
    @Pattern(regexp = "^[a-zA-Z 0-9,.'-]+$",  message = "Bad pattern")
    private String o;
    @Pattern(regexp = "^[a-zA-Z 0-9,.'-]+$",  message = "Bad pattern")
    private String ou;
    @Pattern(regexp = "^[a-zA-Z 0-9,.'-]+",  message = "Bad pattern")
    private String c;
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[a-zA-Z]{2,64}$",  message = "Bad pattern")
    private String e;
    @Pattern(regexp = "^[a-zA-Z 0-9,.'-]+$",  message = "Bad pattern")
    private String s;
    @JsonIgnore
    private UUID subjectAlias;
    @Pattern(regexp = "^[0-9 \\-/+.T:]+$",  message = "Bad pattern")
    private String startDate;
    @Pattern(regexp = "^[0-9 \\-/+.T:]+$",  message = "Bad pattern")
    private String endDate;
    private ArrayList<Boolean> keyUsage;


}
