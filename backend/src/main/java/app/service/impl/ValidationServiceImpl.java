package app.service.impl;

import app.repository.CertificateKeystoreRepository;
import app.repository.CertificateRepository;
import app.service.ValidationService;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x500.style.IETFUtils;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.cert.X509Certificate;
import java.util.Date;

@Service
public class ValidationServiceImpl implements ValidationService {
    private final CertificateKeystoreRepository certificateKeystoreRepository;
    private final CertificateRepository certificateRepository;

    @Autowired
    public ValidationServiceImpl( CertificateRepository certificateRepository, CertificateKeystoreRepository certificateKeystoreRepository) {
        this.certificateKeystoreRepository = certificateKeystoreRepository;
        this.certificateRepository = certificateRepository;
    }

    public Boolean checkInterval(X509Certificate certificate){
        if(certificate.getNotAfter().before(new Date()))
            return false;
        return true;
    }

    @Override
    public Boolean verifyCertificate(X509Certificate certificate) throws Exception {
        try {
            if(!checkInterval(certificate)) {
               return invalidate(certificate);
            }
            X500Name issuerData = new JcaX509CertificateHolder(certificate).getIssuer();
            RDN aliasRDN = issuerData.getRDNs(BCStyle.UID)[0];
            String issuerAlias = IETFUtils.valueToString(aliasRDN.getFirst().getValue());
            if(issuerAlias.equals("root"))
                return true;
            X509Certificate issuerCertificate = (X509Certificate) certificateKeystoreRepository.readCertificate(issuerAlias);
            certificate.verify(issuerCertificate.getPublicKey());
            if(verifyCertificate(issuerCertificate))
                return true;
            return invalidate(certificate);
        } catch (Exception e) {
            e.printStackTrace();
            return invalidate(certificate);
        }
    }

    @Override
    public Boolean invalidate(X509Certificate certificate){
        System.out.println("Kaze igor da ispisem nesto!"  + certificate.getSubjectDN().getName());
        return false;
    }
}
