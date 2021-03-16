package app.repository;

import app.model.CertificateCustom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<CertificateCustom, Long> {
}
