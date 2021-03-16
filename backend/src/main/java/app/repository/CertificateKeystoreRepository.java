package app.repository;

import app.model.data.IssuerData;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.stereotype.Repository;

import java.io.*;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.UUID;

@Repository
public class CertificateKeystoreRepository {
    private final String keystoreFilename = "keystore.jks";
    private final char[] keystorePassword = "K3yst0reP@ssw0rd".toCharArray();
    private final char[] certificatePassword = "C3rt1fic4teP@ssw0rd".toCharArray();
    private KeyStore keyStore;

    public CertificateKeystoreRepository() {
        try {
            keyStore = KeyStore.getInstance("JKS", "SUN");
        } catch (KeyStoreException e) {
            e.printStackTrace();
        } catch (NoSuchProviderException e) {
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

    public List<Certificate> findAll() {
        List<Certificate> certificates = new ArrayList<>();

        loadKeyStore();

        try {
            Enumeration<String> aliases = keyStore.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();

                Certificate cert = readCertificate(alias);
                if (cert != null) certificates.add(cert);
            }
        } catch (KeyStoreException e) {
            e.printStackTrace();
        }

        return certificates;
    }

    public void save(UUID alias, PrivateKey privateKey, Certificate cert) throws KeyStoreException {
        loadKeyStore();
        writeCertificate(alias.toString(), privateKey, cert);
        saveKeyStore();
    }
}
