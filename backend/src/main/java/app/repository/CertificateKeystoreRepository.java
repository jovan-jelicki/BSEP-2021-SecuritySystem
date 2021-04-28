package app.repository;

import app.dtos.CertificateDTO;
import app.dtos.EntityDataDTO;
import app.model.data.IssuerData;
import app.util.Base64Utility;
import io.github.cdimascio.dotenv.Dotenv;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x500.style.IETFUtils;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.*;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.UUID;

@Repository
public class CertificateKeystoreRepository {
    private String keystoreFilename;
    private char[] keystorePassword;
    private char[] certificatePassword;
    private KeyStore keyStore;
    private CertificateFactory cf;
    private final Dotenv env = Dotenv.load();

    public CertificateKeystoreRepository() {
        try {
            keyStore = KeyStore.getInstance("JKS", "SUN");
            cf = CertificateFactory.getInstance("X.509");

            keystoreFilename = this.env.get("KEYSTORE_NAME");
            keystorePassword = this.env.get("KEYSTORE_PASSWORD").toCharArray();
            certificatePassword = this.env.get("CERTIFICATE_PASSWORD").toCharArray();
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
                X509Certificate cert = (X509Certificate) keyStore.getCertificate(alias);
                if (cert != null) {
                    CertificateDTO certificateDTO = new CertificateDTO();
                    X500Name subjectData = new JcaX509CertificateHolder(cert).getSubject();
                    setCertificateParams(alias, cert, certificateDTO, subjectData);
                }
                return cert;
            }
        } catch (KeyStoreException | NoSuchAlgorithmException | CertificateException | IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public String extractEmailFromCertificate(String alias){
        loadKeyStore();
        String email = null;
        try {
            X509Certificate cert = (X509Certificate) readCertificate(alias);
            X500Name subjectData = new JcaX509CertificateHolder(cert).getSubject();
            RDN emailRDN = subjectData.getRDNs(BCStyle.E)[0];
            email = IETFUtils.valueToString(emailRDN.getFirst().getValue());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return email;
    }

    public String extractAliasFromCertificate(Certificate cert) throws KeyStoreException {
        loadKeyStore();
        return keyStore.getCertificateAlias(cert);
    }

    public Resource getDownloadData(String alias){
        loadKeyStore();

        try {
            X509Certificate cert = (X509Certificate) readCertificate(alias);
            String digitalSignature = Base64Utility.encode(cert.getEncoded());
            String retVal = "-----BEGIN CERTIFICATE-----" + digitalSignature + "-----END CERTIFICATE-----";
            ByteArrayResource resource = new ByteArrayResource(retVal.getBytes());
            return resource;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public void writeCertificate(String alias, PrivateKey privateKey, Certificate certificate) throws KeyStoreException {
        keyStore.setKeyEntry(alias, privateKey, certificatePassword, new Certificate[]{certificate});
    }

    public void deleteCertificate(String alias) throws KeyStoreException {
        loadKeyStore();
        keyStore.deleteEntry(alias);
        saveKeyStore();
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

    public ArrayList<CertificateDTO> getCertificateChain(String alias){
        ArrayList<CertificateDTO> retVal = new ArrayList<>();
        String issuerAlias = "";
        try {
            X509Certificate cert = (X509Certificate) readCertificate(alias);
            if(cert != null){
                CertificateDTO certificateDTO = new CertificateDTO();
                X500Name subjectData = new JcaX509CertificateHolder(cert).getSubject();
                X500Name issuerData = new JcaX509CertificateHolder(cert).getIssuer();
                issuerAlias = IETFUtils.valueToString(issuerData.getRDNs(BCStyle.UID)[0].getFirst().getValue());
                setCertificateParams(alias, cert, certificateDTO, subjectData);
                retVal.add(certificateDTO);
            }
        } catch (CertificateEncodingException e) {
            e.printStackTrace();
        }
        if(issuerAlias.equals("root"))
            return retVal;
        retVal.addAll(getCertificateChain(issuerAlias));
        return retVal;
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
                    setCertificateParams(alias, cert, certificateDTO, subjectData);
                    certificates.add(certificateDTO);
                }
            }
        } catch (KeyStoreException | CertificateEncodingException e) {
            e.printStackTrace();
        }

        return certificates;
    }

    public List<CertificateDTO> findAllUsersCertificate(String userEmail) {
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

                    RDN emailRDN = subjectData.getRDNs(BCStyle.E)[0];
                    String certEmail = IETFUtils.valueToString(emailRDN.getFirst().getValue());

                    if(certEmail.equals(userEmail)){
                        setCertificateParams(alias, cert, certificateDTO, subjectData);
                        certificates.add(certificateDTO);
                    }
                }
            }
        } catch (KeyStoreException | CertificateEncodingException e) {
            e.printStackTrace();
        }

        return certificates;
    }

    public List<X509Certificate> findAllChildren(String parentAlias) {
        List<X509Certificate> certificates = new ArrayList<>();

        loadKeyStore();

        try {
            Enumeration<String> aliases = keyStore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                X509Certificate cert = (X509Certificate) readCertificate(alias);
                X500Name subject = new JcaX509CertificateHolder(cert).getSubject();
                RDN pseudonymRDN = subject.getRDNs(BCStyle.PSEUDONYM)[0];
                String pseudonym = IETFUtils.valueToString(pseudonymRDN.getFirst().getValue());

                if(pseudonym.equals("endEntity")) return new ArrayList<>();

                if (cert != null) {
                    X500Name issuer = new JcaX509CertificateHolder(cert).getIssuer();
                    RDN issuerAliasRDN = issuer.getRDNs(BCStyle.UID)[0];
                    String issuerAlias = IETFUtils.valueToString(issuerAliasRDN.getFirst().getValue());
                    if(issuerAlias.equals(parentAlias)) certificates.add(cert);
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
                        setCertificateParams(alias, cert, certificateDTO, subjectData);
                        certificates.add(certificateDTO);
                    }
                }
            }
        } catch (KeyStoreException | CertificateEncodingException e) {
            e.printStackTrace();
        }

        return certificates;
    }

    private void setCertificateParams(String alias, X509Certificate cert, CertificateDTO certificateDTO, X500Name subjectData) throws CertificateEncodingException {
        certificateDTO.setSerialNumber(cert.getSerialNumber().toString());
        certificateDTO.setPublicKey(Base64Utility.encode(cert.getPublicKey().getEncoded()));
        certificateDTO.setAlias(alias);
        certificateDTO.setValidFrom(cert.getNotBefore());
        certificateDTO.setValidTo(cert.getNotAfter());
        certificateDTO.setSubjectData(convertX500Name(subjectData));
        certificateDTO.setKeyUsage(cert.getKeyUsage());
        X500Name issuerData = new JcaX509CertificateHolder(cert).getIssuer();
        certificateDTO.setIssuerData(convertX500Name(issuerData));
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
            setCertificateParams(alias, cert, certificateDTO, subjectData);
            certificates.add(certificateDTO);

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
