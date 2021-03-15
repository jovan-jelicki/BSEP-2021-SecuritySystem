package app.service.impl;

import app.dtos.LoginDTO;
import app.dtos.LoginReturnDTO;
import app.model.Role;
import app.model.User;
import app.repository.UserRepository;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User save(User entity) {
        if(this.findByEmail(entity.getEmail())==null){
            entity.setRole(Role.ROLE_user);
            return userRepository.save(entity);
        }
        return null;
    }

    @Override
    public Collection<User> getAll() { return userRepository.findAll(); }

    @Override
    public Optional<User> findById(Long id) { return userRepository.findById(id);}

    @Override
    public void delete(Long id) { userRepository.deleteById(id);}

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findByEmailAndPassword(String email, String password) { return userRepository.findByEmailAndPassword(email, password);}

    public LoginReturnDTO getUserForLogIn(LoginDTO loginDTO) {
        LoginReturnDTO loginReturnDTO = new LoginReturnDTO();
        User user=this.findByEmailAndPassword(loginDTO.getEmail(),loginDTO.getPassword());
        if(user!=null){
            loginReturnDTO.setId(user.getId());
            loginReturnDTO.setFirstName(user.getFirstName());
            loginReturnDTO.setLastName(user.getLastName());
            loginReturnDTO.setEmail(user.getEmail());
            loginReturnDTO.setRole(user.getRole());
            return loginReturnDTO;
        }
        return null;
    }
}
