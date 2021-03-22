package app.controller;

import app.dtos.CertificateDTO;
import app.dtos.CertificateDataDTO;
import app.service.CertificateService;
import app.service.impl.EndEntityDataGenerator;
import app.service.impl.RootIntermediateDataGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateEncodingException;
import java.text.ParseException;
import java.util.Calendar;
import java.util.List;

@RestController
@RequestMapping(value = "api/certificate")
public class CertificateControllerImpl {
    private static final Logger logger = LoggerFactory.getLogger(CertificateControllerImpl.class);

    private final CertificateService certificateService;

    @Autowired
    public CertificateControllerImpl(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PreAuthorize("hasRole('ROLE_admin')")
    @GetMapping()
    public ResponseEntity<List<CertificateDTO>> getAllCertificates() {
        logger.info("{} - Requesting all available certificates", Calendar.getInstance().getTime());

        List<CertificateDTO> certificates = certificateService.findAllInKeystores();
        // List<CertificateCustom> certificateCustoms = (List<CertificateCustom>) certificateService.getAll();

        logger.info("{} - Retrieved all available certificates", Calendar.getInstance().getTime());

        //return new ResponseEntity<>(certificateCustoms, HttpStatus.OK);
        return new ResponseEntity<>(certificates, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ROLE_admin')")
    @PostMapping("/issueRootIntermediate")
    public ResponseEntity<Void> issueRootIntermediateCertificate(@RequestBody CertificateDataDTO certificateDataDTO) {
        logger.info("{} - Issuing a certificate", Calendar.getInstance().getTime());
        certificateService.setDataGenerator(new RootIntermediateDataGenerator());
        try {
            certificateService.saveToKeyStore(certificateDataDTO);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        logger.info("{} - Issuing a certificate was successful", Calendar.getInstance().getTime());

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ROLE_admin')")
    @PostMapping("/issueEndEntity")
    public ResponseEntity<Void> issueEndEntityCertificate(@RequestBody CertificateDataDTO certificateDataDTO) {
        logger.info("{} - Issuing a certificate", Calendar.getInstance().getTime());
        certificateService.setDataGenerator(new EndEntityDataGenerator());
        try {
            certificateService.saveToKeyStore(certificateDataDTO);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        logger.info("{} - Issuing a certificate was successful", Calendar.getInstance().getTime());

        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
