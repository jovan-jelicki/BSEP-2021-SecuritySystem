package app.controller;

import app.model.User;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/users")
public class UserControllerImpl {
    private final UserService userService;

    @Autowired
    public UserControllerImpl(UserService userService) {
        this.userService = userService;
    }
    @GetMapping("/getUserByEmail/{userEmail}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String userEmail) {
        User user=userService.findByEmail(userEmail);
        if(user!=null){
            return ResponseEntity.ok(user);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

}
