package app.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

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
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date validFrom;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date validTo;
}
