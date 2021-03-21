package app.service.impl;

import app.dtos.CertificateDTO;
import app.dtos.CertificateDataDTO;
import app.model.CertificateCustom;
import app.model.data.IssuerData;
import app.model.data.SubjectData;
import app.repository.CertificateKeystoreRepository;
import app.repository.CertificateRepository;
import app.service.CertificateService;
import app.service.DataGenerator;
import app.util.CertificateGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.*;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import java.text.ParseException;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CertificateServiceImpl implements CertificateService {
    private final CertificateRepository certificateRepository;
    private final CertificateKeystoreRepository certificateKeystoreRepository;
    private final CertificateGenerator certificateGenerator;
    private DataGenerator dataGenerator;

    @Autowired
    public CertificateServiceImpl(@Qualifier("endEntityDataGenerator") DataGenerator dataGenerator, CertificateRepository certificateRepository, CertificateKeystoreRepository certificateKeystoreRepository) {
        this.certificateRepository = certificateRepository;
        this.certificateKeystoreRepository = certificateKeystoreRepository;
        this.certificateGenerator = new CertificateGenerator();
        this.dataGenerator = dataGenerator;
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

    @Override
    public void setDataGenerator(DataGenerator dataGenerator) {
        this.dataGenerator = dataGenerator;
    }


    @Transactional(rollbackFor = {KeyStoreException.class})
    @Override
    public void saveToKeyStore(CertificateDataDTO certificateDataDTO) throws IllegalArgumentException, KeyStoreException, UnrecoverableKeyException, CertificateEncodingException, NoSuchAlgorithmException, ParseException {
        UUID alias = UUID.randomUUID();
        KeyPair keyPairSubject = generateKeyPair();
        certificateDataDTO.setSubjectAlias(alias);
        SubjectData subjectData = dataGenerator.generateSubjectData(keyPairSubject.getPublic(), certificateDataDTO);
        IssuerData issuerData;
        try {
            issuerData = dataGenerator.generateIssuerData(certificateDataDTO);
        }catch (Exception e ){
            throw e;
        }
        X509Certificate cert = certificateGenerator.generateCertificate(subjectData, issuerData, keyPairSubject.getPrivate());

        certificateRepository.save(new CertificateCustom(alias, true));
        certificateKeystoreRepository.save(alias, keyPairSubject.getPrivate(), cert);
    }

    public static KeyPair generateKeyPair() {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
            SecureRandom random = SecureRandom.getInstance("SHA1PRNG", "SUN");
            keyGen.initialize(2048, random);
            return keyGen.generateKeyPair();
        } catch (NoSuchAlgorithmException | NoSuchProviderException e) {
            e.printStackTrace();
        }
        return null;
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
