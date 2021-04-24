package app.service.impl;

import app.dtos.LoginDTO;
import app.dtos.UserTokenDTO;
import app.model.Role;
import app.model.User;
import app.repository.UserRepository;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User save(User entity) {
        if (this.findByEmail(entity.getEmail()) == null) {
            entity.setRole(Role.ROLE_user);
            entity.setPassword(passwordEncoder.encode(entity.getPassword()));
            return userRepository.save(entity);
        }
        return null;
    }

    @Override
    public User saveUser(User entity) {
        entity.setPassword(passwordEncoder.encode(entity.getPassword()));
        return userRepository.save(entity);
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
