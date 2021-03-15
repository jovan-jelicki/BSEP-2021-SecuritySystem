package app.service;

import app.model.User;
import org.springframework.data.jpa.repository.Query;

public interface UserService extends CRUDService<User>{
    User findByEmail(String email);
}
