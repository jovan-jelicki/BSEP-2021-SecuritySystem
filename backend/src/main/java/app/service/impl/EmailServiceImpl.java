package app.service.impl;

import app.model.User;
import app.service.EmailService;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class EmailServiceImpl implements EmailService {
    //private final UserRepository userRepository;
    private final UserService userService;

    @Autowired
    private JavaMailSender mailSender;

    public EmailServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void sendMail(String to, String subject) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);

        String resetCode=generateResetCode();
        String body="Hi,we received a request to reset your password. Your password reset code is: "+resetCode;

        try {
            User user = userService.findByEmail(to);
            user.setResetCode(resetCode);
            userService.save(user);

            message.setText(body);
            mailSender.send(message);
        }catch (Exception e){
            throw new IllegalArgumentException(e);
        }



    }

    public String generateResetCode(){
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();

        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        return generatedString;
    }

}
