package app.service;

import app.dtos.LoginDTO;
import app.dtos.UserTokenDTO;
import app.model.User;

public interface UserService extends CRUDService<User> {
    User findByEmail(String email);

    User findByEmailAndPassword(String email, String password);

    UserTokenDTO getUserForLogIn(LoginDTO loginDTO);

    User saveUser(User entity);

    void changePassword(LoginDTO loginDTO);

}
