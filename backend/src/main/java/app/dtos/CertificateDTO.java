package app.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CertificateDTO {
    private String alias;
    private String serialNumber;
    private EntityDataDTO subjectData;
    private EntityDataDTO issuerData;
    private String publicKey;
    private Date validFrom;
    private Date validTo;
}
