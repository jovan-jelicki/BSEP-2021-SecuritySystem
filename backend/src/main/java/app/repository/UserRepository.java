package app.repository;

import app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long>{
    @Query("select d from User d where d.email = ?1")
    User findByEmail(String email);

    @Query("select u from User u where u.email =?1 and u.password=?2")
    User findByEmailAndPassword(String email,String password);
}
