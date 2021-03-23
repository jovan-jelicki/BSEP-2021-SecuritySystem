package app.service;

import java.security.cert.X509Certificate;

public interface ValidationService {
    public Boolean verifyCertificate(X509Certificate certificate) throws Exception;
    public Boolean invalidate(X509Certificate certificate);
    }
