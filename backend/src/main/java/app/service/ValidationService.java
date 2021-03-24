package app.service;

import app.model.InvalidationReason;

import java.security.cert.X509Certificate;

public interface ValidationService {
    Boolean verifyCertificate(X509Certificate certificate) throws Exception;
    Boolean invalidate(X509Certificate certificate, InvalidationReason reason);
}
