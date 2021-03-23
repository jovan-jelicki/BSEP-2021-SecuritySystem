package app.util;

import app.dtos.CertificateDataDTO;
import app.model.data.IssuerData;
import app.model.data.SubjectData;
import app.repository.CertificateKeystoreRepository;
import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.asn1.x500.style.IETFUtils;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;

import java.math.BigInteger;
import java.security.*;
import java.security.cert.CertificateEncodingException;
import java.security.cert.X509Certificate;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class DataGenerator {
    // Koriste se za serijske brojeve
    private static final int serialNumberLimit = new BigInteger("2500000").bitLength();
    private CertificateKeystoreRepository certificateKeystoreRepository;

 /*   public DataGenerator() {
        this.certificateKeystoreRepository = new CertificateKeystoreRepository();
    }

    private static String generateSerialNumber() {
        Random randNum = new Random();
        BigInteger serialNumber = new BigInteger(serialNumberLimit, randNum);
        return serialNumber.toString();
    }
*/
 /*   public IssuerData generateIssuerData(String alias) throws CertificateEncodingException, UnrecoverableKeyException, NoSuchAlgorithmException, KeyStoreException {
        X509Certificate issuerCertificate = (X509Certificate) certificateKeystoreRepository.readCertificate(alias);
        X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
        X500Name subjectData = new JcaX509CertificateHolder(issuerCertificate).getSubject();

        builder.addRDN(BCStyle.CN,  IETFUtils.valueToString(subjectData.getRDNs(BCStyle.CN)[0].getFirst().getValue()));
        builder.addRDN(BCStyle.SURNAME, IETFUtils.valueToString(subjectData.getRDNs(BCStyle.SURNAME)[0].getFirst().getValue()));
        builder.addRDN(BCStyle.GIVENNAME, IETFUtils.valueToString(subjectData.getRDNs(BCStyle.GIVENNAME)[0].getFirst().getValue()));
        builder.addRDN(BCStyle.O, IETFUtils.valueToString(subjectData.getRDNs(BCStyle.O)[0].getFirst().getValue()));
        builder.addRDN(BCStyle.OU, IETFUtils.valueToString(subjectData.getRDNs(BCStyle.OU)[0].getFirst().getValue()));
        builder.addRDN(BCStyle.C, IETFUtils.valueToString(subjectData.getRDNs(BCStyle.C)[0].getFirst().getValue()));
        builder.addRDN(BCStyle.E, IETFUtils.valueToString(subjectData.getRDNs(BCStyle.E)[0].getFirst().getValue()));
        builder.addRDN(BCStyle.UID, alias);

        return new IssuerData(builder.build(), certificateKeystoreRepository.getPrivateKey(alias));
    }

    public static SubjectData generateSubjectData(PublicKey publicKey, CertificateDataDTO certificateDataDTO) {
        try {
            //Datumi od kad do kad vazi sertifikat
            SimpleDateFormat iso8601Formater = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = iso8601Formater.parse(certificateDataDTO.getStartDate());
            Date endDate = iso8601Formater.parse(certificateDataDTO.getEndDate());

            //klasa X500NameBuilder pravi X500Name objekat koji predstavlja podatke o vlasniku
            X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
            builder.addRDN(BCStyle.CN, certificateDataDTO.getCn());
            builder.addRDN(BCStyle.SURNAME, certificateDataDTO.getSurname());
            builder.addRDN(BCStyle.GIVENNAME, certificateDataDTO.getGivenName());
            builder.addRDN(BCStyle.O, certificateDataDTO.getO());
            builder.addRDN(BCStyle.OU, certificateDataDTO.getOu());
            builder.addRDN(BCStyle.C, certificateDataDTO.getC());
            builder.addRDN(BCStyle.E, certificateDataDTO.getE());
     //       builder.addRDN(BCStyle.UID, certificateDataDTO.getSubjectAlias().toString());

            return new SubjectData(publicKey, builder.build(), generateSerialNumber(), startDate, endDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }
*/


}
