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
public class UserTokenDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private String jwtToken;
}
