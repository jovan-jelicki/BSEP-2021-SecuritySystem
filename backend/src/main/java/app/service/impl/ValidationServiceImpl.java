package app.service.impl;

import app.model.InvalidationReason;
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

import java.security.cert.Certificate;
import java.security.cert.X509Certificate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
            String alias = certificateKeystoreRepository.extractAliasFromCertificate(certificate);
            Optional<Boolean> revoked = Optional.of(certificateRepository.getRevokedStatus(UUID.fromString(alias)).orElse(false));
            if(revoked.get()) return false;

            if(!checkInterval(certificate)) {
               return invalidate(certificate, InvalidationReason.expired);
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
            return invalidate(certificate, InvalidationReason.parentInvalidated);
        } catch (Exception e) {
            e.printStackTrace();
            return invalidate(certificate, InvalidationReason.invalidSignature);
        }
    }

    @Override
    public Boolean invalidate(X509Certificate certificate, InvalidationReason reason){
        // Invalidiramo trenutni
        try{
            String alias = certificateKeystoreRepository.extractAliasFromCertificate(certificate);
            certificateRepository.invalidateCertificate(UUID.fromString(alias), reason);
            certificateKeystoreRepository.deleteCertificate(alias);

            List<X509Certificate> children = certificateKeystoreRepository.findAllChildren(alias);
            if(children.size() == 0) return false;

            for(X509Certificate child : children) invalidate(child, InvalidationReason.parentInvalidated);

        }catch(Exception e){
            e.printStackTrace();
        }

        // Invalidiraj djecu

        return false;
    }


}
