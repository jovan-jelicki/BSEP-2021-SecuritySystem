package app.service.impl;

import app.model.CertificateCustom;
import app.model.data.IssuerData;
import app.model.data.SubjectData;
import app.repository.CertificateKeystoreRepository;
import app.repository.CertificateRepository;
import app.service.CertificateService;
import app.util.CertificateGenerator;
import app.util.MockDataGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.KeyPair;
import java.security.KeyStoreException;
import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateServiceImpl implements CertificateService {
    private final CertificateRepository certificateRepository;
    private final CertificateKeystoreRepository certificateKeystoreRepository;

    @Autowired
    public CertificateServiceImpl(CertificateRepository certificateRepository, CertificateKeystoreRepository certificateKeystoreRepository) {
        this.certificateRepository = certificateRepository;
        this.certificateKeystoreRepository = certificateKeystoreRepository;
    }

    @Override
    public CertificateCustom save(CertificateCustom entity) {
        return certificateRepository.save(entity);
    }

    @Override
    public Collection<CertificateCustom> getAll() {
        return certificateRepository.findAll();
    }

    @Override
    public List<Certificate> findAllInKeystores() {
        return certificateKeystoreRepository.findAll();
    }

    @Transactional(rollbackFor = {KeyStoreException.class})
    @Override
    public void saveToKeystore() throws KeyStoreException {
        KeyPair keyPairSubject = MockDataGenerator.generateKeyPair();
        SubjectData subjectData = MockDataGenerator.generateSubjectData(keyPairSubject.getPublic());

        KeyPair keyPairIssuer = MockDataGenerator.generateKeyPair();
        IssuerData issuerData = MockDataGenerator.generateIssuerData(keyPairIssuer.getPrivate());

        //Generise se sertifikat za subjekta, potpisan od strane issuer-a
        CertificateGenerator cg = new CertificateGenerator();
        X509Certificate cert = cg.generateCertificate(subjectData, issuerData);

        UUID alias = UUID.randomUUID();
        certificateRepository.save(new CertificateCustom(alias, true));
        certificateKeystoreRepository.save(alias, keyPairSubject.getPrivate(), cert);
    }

    @Override
    public Optional<CertificateCustom> findById(Long id) {
        return certificateRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        certificateRepository.deleteById(id);
    }
}
