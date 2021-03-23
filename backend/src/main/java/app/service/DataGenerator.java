package app.service;

import app.dtos.CertificateDataDTO;
import app.dtos.EntityDataDTO;
import app.model.data.IssuerData;
import app.model.data.SubjectData;

import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateEncodingException;
import java.text.ParseException;

public interface DataGenerator {
    SubjectData generateSubjectData(PublicKey publicKey, CertificateDataDTO certificateDataDTO);
    IssuerData generateIssuerData(CertificateDataDTO certificateDataDTO) throws Exception;
}
