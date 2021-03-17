package app.util;

import app.model.data.IssuerData;
import app.model.data.SubjectData;
import org.bouncycastle.asn1.x500.X500NameBuilder;
import org.bouncycastle.asn1.x500.style.BCStyle;

import java.math.BigInteger;
import java.security.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class MockDataGenerator {
    // Koriste se za serijske brojeve
    private static final int serialNumberLimit = new BigInteger("2500000").bitLength();

    private static String generateSerialNumber() {
        Random randNum = new Random();
        BigInteger serialNumber = new BigInteger(serialNumberLimit, randNum);
        return serialNumber.toString();
    }

    public static IssuerData generateIssuerData(PrivateKey issuerKey) {
        X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
        builder.addRDN(BCStyle.CN, "Nikola Luburic");
        builder.addRDN(BCStyle.SURNAME, "Luburic");
        builder.addRDN(BCStyle.GIVENNAME, "Nikola");
        builder.addRDN(BCStyle.O, "UNS-FTN");
        builder.addRDN(BCStyle.OU, "Katedra za informatiku");
        builder.addRDN(BCStyle.C, "RS");
        builder.addRDN(BCStyle.E, "nikola.luburic@uns.ac.rs");
        //UID (USER ID) je ID korisnika
        builder.addRDN(BCStyle.UID, "654321");

        return new IssuerData(builder.build(), issuerKey);
    }

    public static SubjectData generateSubjectData(PublicKey publicKey) {
        try {
            //Datumi od kad do kad vazi sertifikat
            SimpleDateFormat iso8601Formater = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = iso8601Formater.parse("2017-12-31");
            Date endDate = iso8601Formater.parse("2022-12-31");

            //klasa X500NameBuilder pravi X500Name objekat koji predstavlja podatke o vlasniku
            X500NameBuilder builder = new X500NameBuilder(BCStyle.INSTANCE);
            builder.addRDN(BCStyle.CN, "Goran Sladic");
            builder.addRDN(BCStyle.SURNAME, "Sladic");
            builder.addRDN(BCStyle.GIVENNAME, "Goran");
            builder.addRDN(BCStyle.O, "UNS-FTN");
            builder.addRDN(BCStyle.OU, "Katedra za informatiku");
            builder.addRDN(BCStyle.C, "RS");
            builder.addRDN(BCStyle.E, "sladicg@uns.ac.rs");
            //UID (USER ID) je ID korisnika
            builder.addRDN(BCStyle.UID, "123456");

            //Kreiraju se podaci za sertifikat, sto ukljucuje:
            // - javni kljuc koji se vezuje za sertifikat
            // - podatke o vlasniku
            // - serijski broj sertifikata
            // - od kada do kada vazi sertifikat
            return new SubjectData(publicKey, builder.build(), generateSerialNumber(), startDate, endDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
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
}
