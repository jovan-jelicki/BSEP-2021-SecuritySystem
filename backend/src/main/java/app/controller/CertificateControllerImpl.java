package app.controller;
import app.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "api/certificate")
public class CertificateControllerImpl {
    private final CertificateService certificateService;

    @Autowired
    public CertificateControllerImpl(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @PreAuthorize("hasRole('ROLE_admin')")
    @GetMapping("/test")
    public ResponseEntity<String> getTest() {
        return ResponseEntity.ok("Test");
    }
}
