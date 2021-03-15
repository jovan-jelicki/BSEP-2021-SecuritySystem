package app.service.impl;

import app.model.Certificate;
import app.repository.CertificateRepository;
import app.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class CertificateServiceImpl implements CertificateService {
    private CertificateRepository certificateRepository;

    @Autowired
    public CertificateServiceImpl(CertificateRepository certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    @Override
    public Certificate save(Certificate entity) { return certificateRepository.save(entity); }

    @Override
    public Collection<Certificate> getAll() { return certificateRepository.findAll(); }

    @Override
    public Optional<Certificate> findById(Long id) { return certificateRepository.findById(id);}

    @Override
    public void delete(Long id) { certificateRepository.deleteById(id);}
}
