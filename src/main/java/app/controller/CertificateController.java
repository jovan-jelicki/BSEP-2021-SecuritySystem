package app.controller;
import app.service.CertificateService;
import org.springframework.stereotype.Controller;

@Controller
public class CertificateController {
    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }
}
