package app.service;

import app.model.User;

public interface EmailService {
    void sendMail(String to, String subject);
}
