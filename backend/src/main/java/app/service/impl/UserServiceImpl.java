package app.service.impl;

import app.dtos.LoginDTO;
import app.dtos.UserTokenDTO;
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
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User save(User entity) {
        if (this.findByEmail(entity.getEmail()) == null) {
            entity.setRole(Role.ROLE_user);
            return userRepository.save(entity);
        }
        return null;
    }

    @Override
    public Collection<User> getAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User findByEmailAndPassword(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public UserTokenDTO getUserForLogIn(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail());
        if (user != null) {
            UserTokenDTO userTokenDTO = new UserTokenDTO();
            userTokenDTO.setId(user.getId());
            userTokenDTO.setFirstName(user.getFirstName());
            userTokenDTO.setLastName(user.getLastName());
            userTokenDTO.setEmail(user.getEmail());
            userTokenDTO.setRole(user.getRole());
            return userTokenDTO;
        }
        return null;
    }
}
