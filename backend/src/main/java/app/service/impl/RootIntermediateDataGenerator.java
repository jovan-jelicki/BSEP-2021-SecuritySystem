package app.service.impl;

import app.dtos.CertificateDataDTO;
import app.dtos.EntityDataDTO;
import app.model.data.IssuerData;
import app.model.data.SubjectData;
import app.repository.CertificateKeystoreRepository;
import app.service.DataGenerator;
import app.service.ValidationService;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x500.style.IETFUtils;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

@Service
public class RootIntermediateDataGenerator implements DataGenerator {
    private final CertificateKeystoreRepository certificateKeystoreRepository;
    private static final int serialNumberLimit = new BigInteger("2500000").bitLength();
    private final SimpleDateFormat iso8601Formater;
    private final ValidationService validationService;


    public RootIntermediateDataGenerator(ValidationService validationService, CertificateKeystoreRepository certificateKeystoreRepository) {
        this.validationService = validationService;
        this.certificateKeystoreRepository = certificateKeystoreRepository;
        this.iso8601Formater = new SimpleDateFormat("yyyy-MM-dd");
    }

    @Override
    public SubjectData generateSubjectData(PublicKey publicKey, CertificateDataDTO certificateDataDTO) {
        try {

            Date startDate = iso8601Formater.parse(certificateDataDTO.getStartDate());
            Date endDate = iso8601Formater.parse(certificateDataDTO.getEndDate());

            X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
            builder.addRDN(BCStyle.CN, certificateDataDTO.getCn());
            builder.addRDN(BCStyle.O, certificateDataDTO.getO());
            builder.addRDN(BCStyle.OU, certificateDataDTO.getOu());
            builder.addRDN(BCStyle.C, certificateDataDTO.getC());
            builder.addRDN(BCStyle.E, certificateDataDTO.getE());   // email
            builder.addRDN(BCStyle.ST, certificateDataDTO.getS());
            builder.addRDN(BCStyle.UID, certificateDataDTO.getSubjectAlias().toString());
            builder.addRDN(BCStyle.PSEUDONYM, "rootIntermediate");

            return new SubjectData(publicKey, builder.build(), generateSerialNumber(), startDate, endDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public IssuerData generateIssuerData(CertificateDataDTO certificateDataDTO) throws Exception {
        if(certificateDataDTO.getIssuerAlias() == null || certificateDataDTO.getIssuerAlias().equals(""))
            return generateRootIssuer(certificateDataDTO);
        return generateIntermediateIssuer(certificateDataDTO);
    }

    private IssuerData generateIntermediateIssuer(CertificateDataDTO certificateDataDTO) throws Exception {
        X509Certificate issuerCertificate = (X509Certificate) certificateKeystoreRepository.readCertificate(certificateDataDTO.getIssuerAlias());
        if(checkDates(issuerCertificate, certificateDataDTO) && validationService.verifyCertificate(issuerCertificate)) {
            X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
            X500Name subjectData = new JcaX509CertificateHolder(issuerCertificate).getSubject();

            builder.addRDN(BCStyle.CN, IETFUtils.valueToString(subjectData.getRDNs(BCStyle.CN)[0].getFirst().getValue()));
            builder.addRDN(BCStyle.O, IETFUtils.valueToString(subjectData.getRDNs(BCStyle.O)[0].getFirst().getValue()));
            builder.addRDN(BCStyle.C, IETFUtils.valueToString(subjectData.getRDNs(BCStyle.C)[0].getFirst().getValue()));
            builder.addRDN(BCStyle.UID, certificateDataDTO.getIssuerAlias());

            return new IssuerData(builder.build(), certificateKeystoreRepository.getPrivateKey(certificateDataDTO.getIssuerAlias()));
        }
        throw new IllegalArgumentException();

    }

    public Boolean checkDates(X509Certificate certificate, CertificateDataDTO certificateDataDTO) throws ParseException {
        if(certificate.getNotAfter().before(iso8601Formater.parse(certificateDataDTO.getEndDate())))
            return false;
        if( certificate.getNotBefore().after(iso8601Formater.parse(certificateDataDTO.getStartDate())))
            return false;
        if(iso8601Formater.parse(certificateDataDTO.getEndDate()).before(iso8601Formater.parse(certificateDataDTO.getStartDate())))
            return false;
        return true;
    }


    private IssuerData generateRootIssuer(CertificateDataDTO certificateDataDTO) {
        X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
        builder.addRDN(BCStyle.CN,  certificateDataDTO.getCn());
        builder.addRDN(BCStyle.O, certificateDataDTO.getO());
        builder.addRDN(BCStyle.C, certificateDataDTO.getC());
        builder.addRDN(BCStyle.UID, "root");

        return new IssuerData(builder.build(), null);

    }

    private static String generateSerialNumber() {
        Random randNum = new Random();
        BigInteger serialNumber = new BigInteger(serialNumberLimit, randNum);
        return serialNumber.toString();
    }
}
