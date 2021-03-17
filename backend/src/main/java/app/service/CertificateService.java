package app.service;

import app.dtos.CertificateDTO;
import app.dtos.CertificateDataDTO;
import app.model.CertificateCustom;

import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateEncodingException;
import java.util.List;

public interface CertificateService extends CRUDService<CertificateCustom> {
    List<CertificateDTO> findAllInKeystores();

    void saveToKeystore() throws KeyStoreException;

    void saveToKeystoreIssuer(CertificateDataDTO certificateDataDTO) throws KeyStoreException, UnrecoverableKeyException, CertificateEncodingException, NoSuchAlgorithmException;
    }
