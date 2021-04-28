package app.dtos;

public class ChangePasswordDTO {
    private Long userId;
    private String oldPassword;
    private String newPassword;
    private String repeatedPassword;

    public ChangePasswordDTO(Long userId, String oldPassword, String newPassword, String repeatedPassword) {
        this.userId = userId;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.repeatedPassword = repeatedPassword;
    }

    public ChangePasswordDTO() {}

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getRepeatedPassword() {
        return repeatedPassword;
    }

    public void validate() {
        if(!this.oldPassword.matches("^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,}$"))
            throw new IllegalArgumentException();
        if(!this.newPassword.matches("^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,}$"))
            throw new IllegalArgumentException();
        if(!this.repeatedPassword.matches("^(?=.*[\\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,}$"))
            throw new IllegalArgumentException();
    }

    public void setRepeatedPassword(String repeatedPassword) {
        this.repeatedPassword = repeatedPassword;
    }
}
