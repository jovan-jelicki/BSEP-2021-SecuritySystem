package app.controller;

import app.dtos.EmailDTO;
import app.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="api/email")
public class EmailControllerImpl {
    private final EmailService emailService;

    public EmailControllerImpl(EmailService emailService) {
        this.emailService = emailService;
    }

    @Async
    @PutMapping(value = "/send")
    public ResponseEntity<Void> sendMail(@RequestBody EmailDTO emailParams) {
        try {
            emailService.sendMail(emailParams.getTo(), emailParams.getSubject(), emailParams.getBody());
            return new ResponseEntity<>(HttpStatus.OK);

        } catch (NullPointerException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }






}
