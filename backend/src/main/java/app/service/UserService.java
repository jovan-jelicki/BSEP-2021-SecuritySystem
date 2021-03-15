package app.service;

import app.dtos.LoginDTO;
import app.dtos.LoginReturnDTO;
import app.model.User;

public interface UserService extends CRUDService<User>{
    User findByEmail(String email);
    User findByEmailAndPassword(String email, String password);
    LoginReturnDTO getUserForLogIn(LoginDTO loginDTO);
}
