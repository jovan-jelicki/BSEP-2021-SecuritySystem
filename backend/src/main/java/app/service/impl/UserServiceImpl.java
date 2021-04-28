package app.service.impl;

import app.dtos.ChangePasswordDTO;
import app.dtos.LoginDTO;
import app.dtos.RegistrationDTO;
import app.dtos.UserTokenDTO;
import app.model.Role;
import app.model.User;
import app.repository.UserRepository;
import app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
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
    public User registration(RegistrationDTO entity) {
        if (this.findByEmail(entity.getEmail()) == null && entity.getPassword().equals(entity.getRePassword()) ) {
                entity.setRole(Role.ROLE_user);
                entity.setPassword(passwordEncoder.encode(entity.getPassword()));
                entity.setApprovedAccount(false);

                return this.save(new User(entity.getId(), entity.getFirstName(), entity.getLastName(), entity.getEmail(), entity.getPassword(),
                        null, entity.getApprovedAccount(), entity.getRole(),new Date(0)));
            }
        return null;
    }

    @Override
    public User save(User entity) {
        return userRepository.save(entity);
    }

    @Override
    public void changePassword(LoginDTO loginDTO) {
        User user=this.findByEmail(loginDTO.getEmail());
        Date todayDate=new Date();
        if (todayDate.before(user.getTokenEnd())) {
            user.setPassword(passwordEncoder.encode(loginDTO.getPassword()));
            user.setResetCode(null);
            user.setTokenEnd(new Date(0));
            this.save(user);
        }else {
            throw new NullPointerException("Please try again.");
        }
    }

    @Override
    public void approveAccount(ChangePasswordDTO changePasswordDTO) {
        User user = this.findById(changePasswordDTO.getUserId()).get();

            if (this.checkPassword(changePasswordDTO)) {
                    user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
                    user.setResetCode(null);
                    user.setTokenEnd(new Date(0));
                    user.setApprovedAccount(true);
                    this.save(user);
            } else {
                throw new NullPointerException("Please try again.");
            }

    }


    public boolean checkPassword(ChangePasswordDTO changePasswordDTO) {
        User user = this.findById(changePasswordDTO.getUserId()).get();
        if(!passwordEncoder.matches(changePasswordDTO.getOldPassword(),user.getPassword())){
            return false;
        }else if(!changePasswordDTO.getNewPassword().equals(changePasswordDTO.getRepeatedPassword())){
            return false;
        }
        return true;
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
