package app.controller;

import app.dtos.LoginDTO;
import app.dtos.UserTokenDTO;
import app.security.TokenUtils;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthenticationController {
    private final TokenUtils tokenUtils;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @Autowired
    public AuthenticationController(TokenUtils tokenUtils, AuthenticationManager authenticationManager, UserService userService){
        this.tokenUtils = tokenUtils;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<UserTokenDTO> login(@RequestBody LoginDTO loginDTO) {
        Authentication auth;
        try {
            auth = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword()));
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        SecurityContextHolder.getContext().setAuthentication(auth);

        UserTokenDTO user = userService.getUserForLogIn(loginDTO);
        String jwt = tokenUtils.generateToken(user.getEmail(), user.getId());

        return ResponseEntity.ok(new UserTokenDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole(), jwt));
    }
}