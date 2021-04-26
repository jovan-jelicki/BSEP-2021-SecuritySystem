package app.service.impl;

import app.dtos.LoginDTO;
import app.dtos.UserTokenDTO;
import app.model.Role;
import app.model.User;
import app.repository.UserRepository;
import app.security.ParamValidator;
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
    private final ParamValidator paramValidator;

    @Autowired
    public UserServiceImpl(ParamValidator paramValidator, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.paramValidator = paramValidator;
    }

    @Override
    public User save(User entity) {
        if(!paramValidator.validate(entity.getEmail()))
            throw new IllegalArgumentException();
        if(!paramValidator.validate(entity.getPassword()))
            throw new IllegalArgumentException();
        if(!paramValidator.validate(entity.getFirstName()))
            throw new IllegalArgumentException();
        if(!paramValidator.validate(entity.getLastName()))
            throw new IllegalArgumentException();
        if(!paramValidator.validate(entity.getUsername()))
            throw new IllegalArgumentException();

        if (this.findByEmail(entity.getEmail()) == null) {
            entity.setRole(Role.ROLE_user);
            entity.setPassword(passwordEncoder.encode(entity.getPassword()));
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
        if(!paramValidator.validate(email))
            throw new IllegalArgumentException();
        return userRepository.findByEmail(email);
    }

    @Override
    public User findByEmailAndPassword(String email, String password) {
        if(!paramValidator.validate(email))
            throw new IllegalArgumentException();
        if(!paramValidator.validate(password))
            throw new IllegalArgumentException();
        return userRepository.findByEmailAndPassword(email, password);
    }

    public UserTokenDTO getUserForLogIn(LoginDTO loginDTO) {
        if(!paramValidator.validate(loginDTO.getEmail()))
            throw new IllegalArgumentException();
        if(!paramValidator.validate(loginDTO.getPassword()))
            throw new IllegalArgumentException();

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
