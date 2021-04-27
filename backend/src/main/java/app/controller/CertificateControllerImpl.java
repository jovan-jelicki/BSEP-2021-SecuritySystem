package app.controller;

import app.dtos.CertificateDTO;
import app.dtos.CertificateDataDTO;
import app.dtos.DownloadRequestDTO;
import app.service.CertificateService;
import app.service.DataGenerator;
import app.service.PermissionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "api/certificate")
public class CertificateControllerImpl {
    private static final Logger logger = LoggerFactory.getLogger(CertificateControllerImpl.class);

    private final CertificateService certificateService;
    private final DataGenerator endEntityDataGenerator;
    private final DataGenerator rootIntermediateDataGenerator;

    @Autowired
    public CertificateControllerImpl(@Qualifier("endEntityDataGenerator") DataGenerator dataGeneratorEndEntity, @Qualifier("rootIntermediateDataGenerator") DataGenerator dataGeneratorRoot, CertificateService certificateService) {
        this.certificateService = certificateService;
        this.endEntityDataGenerator = dataGeneratorEndEntity;
        this.rootIntermediateDataGenerator = dataGeneratorRoot;
    }

    //@PreAuthorize("hasRole('ROLE_admin')")
    @PreAuthorize("@permissionService.checkPermission('getAllCertificates')")
    @GetMapping()
    public ResponseEntity<List<CertificateDTO>> getAllCertificates() {
        logger.info("{} - Requesting all available certificates", Calendar.getInstance().getTime());

        List<CertificateDTO> certificates = certificateService.findAllInKeystores();

        logger.info("{} - Retrieved all available certificates", Calendar.getInstance().getTime());

        return new ResponseEntity<>(certificates, HttpStatus.OK);
    }

    //@PreAuthorize("hasAnyRole('ROLE_admin, ROLE_user')")
    @PreAuthorize("@permissionService.checkPermission('downloadCertificate')")
    @PostMapping("/download")
    public ResponseEntity<Resource> downloadCertificate(@RequestBody DownloadRequestDTO downloadRequest) {
        logger.info("{} - Downloading certificate {}", Calendar.getInstance().getTime(), downloadRequest.getCertificateAlias());

        Resource file = null;
        try{
           file = certificateService.prepareCertificateForDownload(downloadRequest);
           return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"certificate.cer\"")
                    .body(file);
        } catch(Exception e){
            return ResponseEntity.badRequest()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"null\"")
                    .body(file);
        }
    }

    //@PreAuthorize("hasRole('ROLE_admin')")
    @PreAuthorize("@permissionService.checkPermission('getAllRootInterCertificates')")
    @GetMapping("/getRootInter")
    public ResponseEntity<List<CertificateDTO>> getAllRootInterCertificates() {
        logger.info("{} - Requesting all available certificates", Calendar.getInstance().getTime());

        List<CertificateDTO> certificates = certificateService.findAllRootInterCertificates();

        logger.info("{} - Retrieved all available certificates", Calendar.getInstance().getTime());

        //return new ResponseEntity<>(certificateCustoms, HttpStatus.OK);
        return new ResponseEntity<>(certificates, HttpStatus.OK);
    }

    //@PreAuthorize("hasRole('ROLE_admin')")
    @PreAuthorize("@permissionService.checkPermission('invalidateCertificate')")
    @PostMapping("/invalidate/{alias}")
    public ResponseEntity<Void> invalidateCertificate(@PathVariable UUID alias) {
        logger.info("{} - Invalidating certificate {}", Calendar.getInstance().getTime(), alias.toString());

        boolean invalidated = certificateService.invalidateCertificate(alias);

        if (invalidated){
            logger.info("{} - Invalidated certificate {}", Calendar.getInstance().getTime(), alias.toString());
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            logger.info("{} - Failed to invalidate certificate {}", Calendar.getInstance().getTime(), alias.toString());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    //@PreAuthorize("hasRole('ROLE_user')")
    @PreAuthorize("@permissionService.checkPermission('findAllUsersCertificate')")
    @GetMapping("/findAllUsersCertificate/{userEmail}")
    public ResponseEntity<List<CertificateDTO>> findAllUsersCertificate(@PathVariable String userEmail) {
        List<CertificateDTO> certificates = certificateService.findAllUsersCertificate(userEmail);

        return new ResponseEntity<>(certificates, HttpStatus.OK);
    }


    //@PreAuthorize("hasRole('ROLE_admin')")
    @PreAuthorize("@permissionService.checkPermission('issueRootIntermediateCertificate')")
    @PostMapping("/issueRootIntermediate")
    public ResponseEntity<Void> issueRootIntermediateCertificate(@RequestBody CertificateDataDTO certificateDataDTO) {
        logger.info("{} - Issuing a certificate", Calendar.getInstance().getTime());
        certificateService.setDataGenerator(rootIntermediateDataGenerator);
        try {
            certificateService.saveToKeyStore(certificateDataDTO);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        logger.info("{} - Issuing a certificate was successful", Calendar.getInstance().getTime());

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //@PreAuthorize("hasRole('ROLE_admin')")
    @PreAuthorize("@permissionService.checkPermission('issueEndEntityCertificate')")
    @PostMapping("/issueEndEntity")
    public ResponseEntity<Void> issueEndEntityCertificate(@RequestBody CertificateDataDTO certificateDataDTO) {
        logger.info("{} - Issuing a certificate", Calendar.getInstance().getTime());
        certificateService.setDataGenerator(endEntityDataGenerator);
        try {
            certificateService.saveToKeyStore(certificateDataDTO);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        logger.info("{} - Issuing a certificate was successful", Calendar.getInstance().getTime());

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    //@PreAuthorize("hasAnyRole('ROLE_admin, ROLE_user')")
    @PreAuthorize("@permissionService.checkPermission('issueEndEntityCertificate')")
    @GetMapping("/getChain/{alias}")
    public ResponseEntity<Collection<CertificateDTO>> getCertificateChain(@PathVariable String alias){
        return new ResponseEntity<>(certificateService.getCertificateChain(alias), HttpStatus.OK);
    }
}
