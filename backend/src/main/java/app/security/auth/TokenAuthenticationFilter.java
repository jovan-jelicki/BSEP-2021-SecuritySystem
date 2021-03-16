package app.security.auth;

import app.model.Role;
import app.security.TokenUtils;
import app.service.impl.FilterUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class TokenAuthenticationFilter extends OncePerRequestFilter {
    private final TokenUtils tokenUtils;
    private final UserDetailsService userDetailsService;

    public TokenAuthenticationFilter(TokenUtils tokenHelper, UserDetailsService userDetailsService) {
        this.tokenUtils = tokenHelper;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        String email;
        String authToken = tokenUtils.getToken(httpServletRequest);

        if (authToken != null) {

            email = tokenUtils.getUsernameFromToken(authToken);
            if (email != null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (tokenUtils.validateToken(authToken, userDetails)) {
                    TokenBasedAuthentication authentication = new TokenBasedAuthentication(userDetails);
                    authentication.setToken(authToken);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
}
