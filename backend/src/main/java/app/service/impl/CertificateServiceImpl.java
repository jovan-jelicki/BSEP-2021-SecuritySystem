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
import app.service.ValidationService;
import app.util.CertificateGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.*;
import java.security.cert.X509Certificate;
import java.util.*;

@Service
public class CertificateServiceImpl implements CertificateService {
    private final CertificateRepository certificateRepository;
    private final CertificateKeystoreRepository certificateKeystoreRepository;
    private final CertificateGenerator certificateGenerator;
    private DataGenerator dataGenerator;
    private final ValidationService validationService;

    @Autowired
    public CertificateServiceImpl(@Qualifier("endEntityDataGenerator") DataGenerator dataGenerator, ValidationService validationService ,CertificateRepository certificateRepository, CertificateKeystoreRepository certificateKeystoreRepository) {
        this.certificateRepository = certificateRepository;
        this.certificateKeystoreRepository = certificateKeystoreRepository;
        this.certificateGenerator = new CertificateGenerator();
        this.dataGenerator = dataGenerator;
        this.validationService = validationService;
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
        return (List<CertificateDTO>) returnValidCertificates(certificateKeystoreRepository.findAll());
    }

    @Override
    public List<CertificateDTO> findAllRootInterCertificates() {
        return (List<CertificateDTO>) returnValidCertificates(certificateKeystoreRepository.findAllRootInterCertificates());
    }

    public Collection<CertificateDTO> returnValidCertificates(Collection<CertificateDTO> certificateDTOS) {
        Collection<CertificateDTO> retVal = new ArrayList<CertificateDTO>();
        for(CertificateDTO cert : certificateDTOS){
            try {
                if(validationService.verifyCertificate((X509Certificate) certificateKeystoreRepository.readCertificate(cert.getAlias()))){
                    retVal.add(cert);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return retVal;
    }

    @Override
    public void setDataGenerator(DataGenerator dataGenerator) {
        this.dataGenerator = dataGenerator;
    }


    @Transactional(rollbackFor = {KeyStoreException.class})
    @Override
    public void saveToKeyStore(CertificateDataDTO certificateDataDTO) throws Exception {
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
        boolean[] proba = new boolean[] {};
        try {
            proba = cert.getKeyUsage();
        } catch (Exception e) {
            e.printStackTrace();
        }
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
