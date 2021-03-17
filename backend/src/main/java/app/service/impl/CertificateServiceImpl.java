package app.service.impl;

import app.dtos.CertificateDTO;
import app.dtos.CertificateDataDTO;
import app.model.CertificateCustom;
import app.model.data.IssuerData;
import app.model.data.SubjectData;
import app.repository.CertificateKeystoreRepository;
import app.repository.CertificateRepository;
import app.service.CertificateService;
import app.util.CertificateGenerator;
import app.util.DataGenerator;
import app.util.MockDataGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.KeyPair;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateServiceImpl implements CertificateService {
    private final CertificateRepository certificateRepository;
    private final CertificateKeystoreRepository certificateKeystoreRepository;
    private final DataGenerator dataGenerator;

    @Autowired
    public CertificateServiceImpl(CertificateRepository certificateRepository, CertificateKeystoreRepository certificateKeystoreRepository) {
        this.certificateRepository = certificateRepository;
        this.certificateKeystoreRepository = certificateKeystoreRepository;
        this.dataGenerator = new DataGenerator();
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
    public List<CertificateDTO> findAllInKeystores() {
        return certificateKeystoreRepository.findAll();
    }

    @Transactional(rollbackFor = {KeyStoreException.class})
    @Override
    public void saveToKeystore() throws KeyStoreException {
        UUID alias = UUID.randomUUID();
        KeyPair keyPairSubject = MockDataGenerator.generateKeyPair();
        SubjectData subjectData = MockDataGenerator.generateSubjectData(keyPairSubject.getPublic());

        KeyPair keyPairIssuer = MockDataGenerator.generateKeyPair();
        IssuerData issuerData = MockDataGenerator.generateIssuerData(keyPairIssuer.getPrivate());

        //Generise se sertifikat za subjekta, potpisan od strane issuer-a
        CertificateGenerator cg = new CertificateGenerator();
        X509Certificate cert = cg.generateCertificate(subjectData, issuerData);

        certificateRepository.save(new CertificateCustom(alias, true));
        certificateKeystoreRepository.save(alias, keyPairSubject.getPrivate(), cert);
    }

    @Transactional(rollbackFor = {KeyStoreException.class})
    @Override
    public void saveToKeystoreIssuer(CertificateDataDTO certificateDataDTO) throws KeyStoreException, UnrecoverableKeyException, CertificateEncodingException, NoSuchAlgorithmException {
        UUID alias = UUID.randomUUID();
        KeyPair keyPairSubject = dataGenerator.generateKeyPair();
        certificateDataDTO.setSubjectAlias(alias);
        SubjectData subjectData = dataGenerator.generateSubjectData(keyPairSubject.getPublic(), certificateDataDTO);

        IssuerData issuerData = dataGenerator.generateIssuerData(certificateDataDTO.getIssuerAlias());

        //Generise se sertifikat za subjekta, potpisan od strane issuer-a
        CertificateGenerator cg = new CertificateGenerator();
        X509Certificate cert = cg.generateCertificate(subjectData, issuerData);

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
