package app.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DownloadRequestDTO {
    String userEmail;
    UUID certificateAlias;

    public Boolean validate(){
        if(!this.userEmail.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[a-zA-Z]{2,64}$"))
            throw new IllegalArgumentException();
        return true;
    }

}
