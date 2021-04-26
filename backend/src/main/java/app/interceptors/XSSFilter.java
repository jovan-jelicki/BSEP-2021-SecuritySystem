package app.interceptors;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.owasp.esapi.ESAPI;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import javax.servlet.Filter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.ServletException;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

// Koristi se za sprecavanje reflektovanih XSS napada, jer uklanja potencijalno maliciozni kod iz headera,
// parametera i tela svakog zahteva.
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)  // Highest Precedence - najvisi prioritet medju filterima
public class XSSFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        XSSRequestWrapper wrappedRequest =
                new XSSRequestWrapper((HttpServletRequest) request);
        String body = IOUtils.toString(wrappedRequest.getReader());
        if (!StringUtils.isBlank(body)) {
            body = stripXSS(body);
            wrappedRequest.resetInputStream(body.getBytes());
        }
        chain.doFilter(wrappedRequest, response);
    }

    public static String stripXSS(String value) {
        /*if (value == null) {
            return null;
        }*/
        value = ESAPI.encoder()
                .canonicalize(value)
                .replaceAll("\0", "");
        return Jsoup.clean(value, Whitelist.none());
    }
}