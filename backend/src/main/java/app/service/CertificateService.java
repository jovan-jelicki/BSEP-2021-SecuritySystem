package app.service;

import app.model.CertificateCustom;

import java.security.KeyStoreException;
import java.security.cert.Certificate;
import java.util.List;

public interface CertificateService extends CRUDService<CertificateCustom> {
    List<Certificate> findAllInKeystores();

    void saveToKeystore() throws KeyStoreException;
}
