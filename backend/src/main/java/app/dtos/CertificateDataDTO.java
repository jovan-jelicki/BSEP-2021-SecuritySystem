package app.dtos;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor      
public class CertificateDataDTO {
    private String issuerAlias;
    private String cn;
    private String surname;
    private String givenname;
    private String o;
    private String ou;
    private String c;
    private String e;
    @JsonIgnore
    private UUID subjectAlias;
    private String startDate;
    private String endDate;

}
