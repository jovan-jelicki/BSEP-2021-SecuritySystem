package app.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Certificate {
    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String serialNumber;

    @Column(nullable = false)
    private Boolean isActive;
}
