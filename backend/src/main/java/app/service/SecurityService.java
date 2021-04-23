package app.service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class SecurityService {

    public List<String> getBlacklistedPasswords() throws IOException {
        BufferedReader in = null;
        List<String> passwords = new ArrayList<>();
        try {
            System.out.println("Working Directory = " + System.getProperty("user.dir"));
            in = new BufferedReader(new FileReader("./src/main/java/app/security/password_blacklist.txt"));
            String str;
            while ((str = in.readLine()) != null) {
                passwords.add(str);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (in != null) {
                in.close();
            }
        }

        return passwords;
    }
}
