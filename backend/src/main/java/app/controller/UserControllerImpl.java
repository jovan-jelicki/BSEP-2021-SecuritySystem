package app.controller;

import app.dtos.LoginDTO;
import app.dtos.LoginReturnDTO;
import app.model.User;
import app.security.TokenUtils;
import app.service.UserService;
import app.service.impl.FilterUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "auth/users")
public class UserControllerImpl {
    @Autowired
    private FilterUserDetailsService filterUserDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private TokenUtils tokenUtils;

    @Autowired
    public UserControllerImpl() { }

    @PostMapping(consumes = "application/json")
    public ResponseEntity<LoginReturnDTO> login(@RequestBody LoginDTO loginDTO){
        LoginReturnDTO loginReturnDTO=userService.getUserForLogIn(loginDTO);
        if(loginReturnDTO!=null){
            String jwt=tokenUtils.generateToken(loginReturnDTO.getEmail(), loginReturnDTO.getId(), loginReturnDTO.getRole());
            loginReturnDTO.setJwtToken(jwt);
            return new ResponseEntity<>(loginReturnDTO, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping(value="/save", consumes = "application/json")
    public ResponseEntity<User> save(@RequestBody User entity) {
        User user=userService.save(entity);
        if(user!=null)
            return new ResponseEntity<>(userService.save(entity), HttpStatus.CREATED);

        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }


}
