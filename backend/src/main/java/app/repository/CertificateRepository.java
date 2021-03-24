package app.repository;

import app.model.CertificateCustom;
import app.model.InvalidationReason;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<CertificateCustom, Long> {
    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE certificates SET is_invalidated = false, reason = ?2 WHERE alias = ?1")
    void invalidateCertificate(UUID alias, InvalidationReason reason);

    @Transactional(readOnly = true)
    @Query(nativeQuery = true, value = "SELECT is_invalidated FROM certificates WHERE alias = ?1")
    Optional<Boolean> getRevokedStatus(UUID alias);
}
