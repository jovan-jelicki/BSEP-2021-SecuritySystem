package app.controller;

import app.service.SecurityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Calendar;
import java.util.List;

@RestController
@RequestMapping(value = "security")
public class SecurityController {
    private static final Logger logger = LoggerFactory.getLogger(SecurityController.class);

    private final SecurityService securityService;

    @Autowired
    public SecurityController(SecurityService securityService){
        this.securityService = securityService;
    }

    @GetMapping("/passwords")
    public ResponseEntity<List<String>> getBlacklistedPasswords() {
        logger.info("{} - Requesting blacklisted passwords", Calendar.getInstance().getTime());

        List<String> passwords = securityService.getBlacklistedPasswords();

        logger.info("{} - Retrieved blacklisted passwords", Calendar.getInstance().getTime());

        return new ResponseEntity<>(passwords, HttpStatus.OK);
    }
}
