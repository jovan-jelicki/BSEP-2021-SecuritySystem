package app.dtos;

public class EmailDTO {
    private String to;
    private String subject;
    private long userId;

    public  EmailDTO(){
    }



    public EmailDTO(String to, String subject, long userId) {
        this.to = to;
        this.subject = subject;
        this.userId = userId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getTo() { return to; }

    public void setTo(String to) {  this.to = to;}

    public String getSubject() {return subject; }

    public void setSubject(String subject) {this.subject = subject;}
    
}
