package app.repository;

import app.dtos.CertificateDTO;
import app.dtos.EntityDataDTO;
import app.model.data.IssuerData;
import app.service.ValidationService;
import app.util.Base64Utility;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x500.style.IETFUtils;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.*;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Repository
public class CertificateKeystoreRepository {
    private final String keystoreFilename = "keystore.jks";
    private final char[] keystorePassword = "K3yst0reP@ssw0rd".toCharArray();
    private final char[] certificatePassword = "C3rt1fic4teP@ssw0rd".toCharArray();
    private KeyStore keyStore;
    private CertificateFactory cf;

    public CertificateKeystoreRepository() {
        try {

            keyStore = KeyStore.getInstance("JKS", "SUN");
            cf = CertificateFactory.getInstance("X.509");
        } catch (KeyStoreException | NoSuchProviderException | CertificateException e) {
            e.printStackTrace();
        }
    }

    public void loadKeyStore() {
        try {
            File file = new File(keystoreFilename);
            if (file.exists()) {
                keyStore.load(new FileInputStream(file), keystorePassword);
            } else {
                keyStore.load(null, null);
                saveKeyStore();
            }
        } catch (NoSuchAlgorithmException | CertificateException | IOException e) {
            e.printStackTrace();
        }
    }

    public void saveKeyStore() {
        try {
            keyStore.store(new FileOutputStream(keystoreFilename), keystorePassword);
        } catch (KeyStoreException | NoSuchAlgorithmException | CertificateException | IOException e) {
            e.printStackTrace();
        }
    }

    public Certificate readCertificate(String alias) {
        try {
            BufferedInputStream in = new BufferedInputStream(new FileInputStream(keystoreFilename));
            keyStore.load(in, keystorePassword);

            if (keyStore.isKeyEntry(alias)) {
                Certificate cert = keyStore.getCertificate(alias);
                return cert;
            }
        } catch (KeyStoreException | NoSuchAlgorithmException | CertificateException | IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public void writeCertificate(String alias, PrivateKey privateKey, Certificate certificate) throws KeyStoreException {
        keyStore.setKeyEntry(alias, privateKey, certificatePassword, new Certificate[]{certificate});
    }

    public IssuerData readIssuerFromStore(String alias) {
        try {
            BufferedInputStream in = new BufferedInputStream(new FileInputStream(keystoreFilename));
            keyStore.load(in, keystorePassword);

            Certificate cert = keyStore.getCertificate(alias);

            PrivateKey privKey = (PrivateKey) keyStore.getKey(alias, certificatePassword);

            X500Name issuerName = new JcaX509CertificateHolder((X509Certificate) cert).getSubject();
            return new IssuerData(issuerName, privKey);
        } catch (KeyStoreException | NoSuchAlgorithmException | CertificateException | UnrecoverableKeyException | IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<CertificateDTO> findAll() {
        List<CertificateDTO> certificates = new ArrayList<>();

        loadKeyStore();

        try {
            Enumeration<String> aliases = keyStore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                X509Certificate cert = (X509Certificate) readCertificate(alias);

                if (cert != null) {
                    CertificateDTO certificateDTO = new CertificateDTO();
                    X500Name subjectData = new JcaX509CertificateHolder(cert).getSubject();
                    setCertificateParams(certificates, alias, cert, certificateDTO, subjectData);
                }
            }
        } catch (KeyStoreException | CertificateEncodingException e) {
            e.printStackTrace();
        }

        return certificates;
    }

    public List<CertificateDTO> findAllRootInterCertificates() {
        List<CertificateDTO> certificates = new ArrayList<>();

        loadKeyStore();

        try {
            Enumeration<String> aliases = keyStore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                X509Certificate cert = (X509Certificate) readCertificate(alias);

                if (cert != null) {
                    CertificateDTO certificateDTO = new CertificateDTO();
                    X500Name subjectData = new JcaX509CertificateHolder(cert).getSubject();
                    String pseudonym=IETFUtils.valueToString(subjectData.getRDNs(BCStyle.PSEUDONYM)[0].getFirst().getValue());

                    if(pseudonym.equals("rootIntermediate")){
                        setCertificateParams(certificates, alias, cert, certificateDTO, subjectData);
                    }
                }
            }
        } catch (KeyStoreException | CertificateEncodingException e) {
            e.printStackTrace();
        }

        return certificates;
    }

    private void setCertificateParams(List<CertificateDTO> certificates, String alias, X509Certificate cert, CertificateDTO certificateDTO, X500Name subjectData) throws CertificateEncodingException {
        certificateDTO.setSerialNumber(cert.getSerialNumber().toString());
        certificateDTO.setPublicKey(Base64Utility.encode(cert.getPublicKey().getEncoded()));
        certificateDTO.setAlias(alias);
        certificateDTO.setValidFrom(cert.getNotBefore());
        certificateDTO.setValidTo(cert.getNotAfter());
        certificateDTO.setSubjectData(convertX500Name(subjectData));
        X500Name issuerData = new JcaX509CertificateHolder(cert).getIssuer();
        certificateDTO.setIssuerData(convertX500Name(issuerData));
        certificates.add(certificateDTO);
    }

    public List<CertificateDTO> checkCertificates(X509Certificate cert, String alias) throws CertificateEncodingException {
        List<CertificateDTO> certificates = new ArrayList<>();

        if (cert != null) {
            CertificateDTO certificateDTO = new CertificateDTO();
            X500Name subjectData = new JcaX509CertificateHolder(cert).getSubject();
            String pseudonym=IETFUtils.valueToString(subjectData.getRDNs(BCStyle.PSEUDONYM)[0].getFirst().getValue());
            if(!pseudonym.equals("rootIntermediate")){
               return null;
            }
            setCertificateParams(certificates, alias, cert, certificateDTO, subjectData);

        }
        return certificates;
    }

    public PrivateKey getPrivateKey(String alias) throws UnrecoverableKeyException, NoSuchAlgorithmException, KeyStoreException {
       try {
           Key key = keyStore.getKey(alias, certificatePassword);
           return (PrivateKey) key;
       } catch (UnrecoverableKeyException e){
           throw new UnrecoverableKeyException();
       }catch (NoSuchAlgorithmException e) {
           throw  new NoSuchAlgorithmException();
       }catch (KeyStoreException e) {
           throw new KeyStoreException();
       }catch (Exception e) {
           throw new Error();
       }

    }

    public EntityDataDTO convertX500Name(X500Name x500Name) {
        RDN nameRDN = x500Name.getRDNs(BCStyle.CN)[0];
        RDN organizationRDN = x500Name.getRDNs(BCStyle.O)[0];
        RDN countryRDN = x500Name.getRDNs(BCStyle.C)[0];
        RDN aliasRDN = x500Name.getRDNs(BCStyle.UID)[0];
        String name = IETFUtils.valueToString(nameRDN.getFirst().getValue());
        String organization = IETFUtils.valueToString(organizationRDN.getFirst().getValue());
        String country = IETFUtils.valueToString(countryRDN.getFirst().getValue());
        String alias = IETFUtils.valueToString(aliasRDN.getFirst().getValue());

        return new EntityDataDTO(name, organization, country,alias);
    }

    public void save(UUID alias, PrivateKey privateKey, Certificate cert) throws KeyStoreException {
        loadKeyStore();
        writeCertificate(alias.toString(), privateKey, cert);
        saveKeyStore();
    }
}
