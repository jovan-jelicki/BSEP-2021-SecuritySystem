package app.controller;

import app.dtos.ChangePasswordDTO;
import app.model.User;
import app.service.SecurityService;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/users")
public class UserControllerImpl {
    private final UserService userService;
    private final SecurityService securityService;

    @Autowired
    public UserControllerImpl(UserService userService, SecurityService securityService) {
        this.userService = userService;
        this.securityService = securityService;
    }

    @GetMapping("/getUserByEmail/{userEmail}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String userEmail) {
        if(!userEmail.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[a-zA-Z]{2,64}$"))
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        User user=userService.findByEmail(userEmail);
        if(user!=null){
            return ResponseEntity.ok(user);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    //@PreAuthorize("hasAnyRole('ROLE_admin, ROLE_user')")
    @PreAuthorize("@permissionService.checkPermission('isAccountApproved')")
    @GetMapping( "/isAccountApproved/{id}")
    public ResponseEntity<Boolean> isAccountApproved(@PathVariable Long id){
        return new ResponseEntity<>(userService.findById(id).get().getApprovedAccount(), HttpStatus.OK);
    }

    //@PreAuthorize("hasAnyRole('ROLE_admin, ROLE_user')")
    @PreAuthorize("@permissionService.checkPermission('approveAccount')")
    @PostMapping(value="/approveAccount", consumes = "application/json")
    public ResponseEntity<Void> approveAccount(@RequestBody ChangePasswordDTO changePasswordDTO) {
        List<String> blacklistedPasswords = securityService.getBlacklistedPasswords();
        if(blacklistedPasswords.contains(changePasswordDTO.getNewPassword())){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        try {
            changePasswordDTO.validate();
            userService.approveAccount(changePasswordDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
