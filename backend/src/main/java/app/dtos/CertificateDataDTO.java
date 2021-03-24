package app.dtos;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private String issuerAlias;
    private String cn;
    private String surname;
    private String givenName;
    private String o;
    private String ou;
    private String c;
    private String e;
    private String s;
    @JsonIgnore
    private UUID subjectAlias;
    private String startDate;
    private String endDate;
    private ArrayList<Boolean> keyUsage;

}
