package app.controller;

import app.dtos.ChangePasswordDTO;
import app.dtos.LoginDTO;
import app.dtos.UserTokenDTO;
import app.model.User;
import app.security.TokenUtils;
import app.service.SecurityService;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthenticationController {
    private final TokenUtils tokenUtils;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final SecurityService securityService;

    @Autowired
    public AuthenticationController(TokenUtils tokenUtils, AuthenticationManager authenticationManager, UserService userService, SecurityService securityService) {
        this.tokenUtils = tokenUtils;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.securityService = securityService;
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

    @PostMapping(value="/save", consumes = "application/json")
    public ResponseEntity<User> save(@RequestBody User entity) {
        List<String> blacklistedPasswords = securityService.getBlacklistedPasswords();
        if(blacklistedPasswords.contains(entity.getPassword())){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        if(userService.save(entity)==null){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(userService.save(entity), HttpStatus.CREATED);
    }


    @PostMapping(value="/changePassword", consumes = "application/json")
    public ResponseEntity<Void> changePassword(@RequestBody LoginDTO loginDTO) {
        List<String> blacklistedPasswords = securityService.getBlacklistedPasswords();
        if(blacklistedPasswords.contains(loginDTO.getPassword())){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        try {
            userService.changePassword(loginDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }



}