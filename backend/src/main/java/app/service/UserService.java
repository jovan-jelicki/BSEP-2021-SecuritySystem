package app.service;

import app.dtos.ChangePasswordDTO;
import app.dtos.LoginDTO;
import app.dtos.UserTokenDTO;
import app.model.User;
import org.springframework.web.bind.annotation.RequestBody;

public interface UserService extends CRUDService<User> {
    User findByEmail(String email);

    User findByEmailAndPassword(String email, String password);

    UserTokenDTO getUserForLogIn(LoginDTO loginDTO);

    User saveUser(User entity);

    void changePassword(LoginDTO loginDTO);
    void approveAccount( ChangePasswordDTO changePasswordDTO);
}
