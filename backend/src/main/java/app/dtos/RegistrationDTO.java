package app.dtos;

import app.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String rePassword;
    private Role role;
    private Boolean approvedAccount;



    public void validateUser() {
        if(!this.email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[a-zA-Z]{2,64}$"))
            throw new IllegalArgumentException();
        if(!this.firstName.matches("^[a-zA-Z ,.'-]+$"))
            throw new IllegalArgumentException();
        if(!this.lastName.matches("^[a-zA-Z ,.'-]+$"))
            throw new IllegalArgumentException();
        if(!this.password.matches("^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,}$"))
            throw new IllegalArgumentException();
    }

}
