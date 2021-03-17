package app.service;

import app.dtos.CertificateDTO;
import app.model.CertificateCustom;

import java.security.KeyStoreException;
import java.util.List;

public interface CertificateService extends CRUDService<CertificateCustom> {
    List<CertificateDTO> findAllInKeystores();

    void saveToKeystore() throws KeyStoreException;
}
