package app.service.impl;

import app.model.User;
import app.repository.UserRepository;
import app.service.UserService;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User save(User entity) { return userRepository.save(entity); }

    @Override
    public Collection<User> getAll() { return userRepository.findAll(); }

    @Override
    public Optional<User> findById(Long id) { return userRepository.findById(id);}

    @Override
    public void delete(Long id) { userRepository.deleteById(id);}
}
