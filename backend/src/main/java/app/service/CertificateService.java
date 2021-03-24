package app.service;

import app.dtos.CertificateDTO;
import app.dtos.CertificateDataDTO;
import app.dtos.DownloadRequestDTO;
import app.model.CertificateCustom;
import org.springframework.core.io.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public interface CertificateService extends CRUDService<CertificateCustom> {
    List<CertificateDTO> findAllUsersCertificate(String userEmail);
    List<CertificateDTO> findAllInKeystores();
    List<CertificateDTO> findAllRootInterCertificates();
    void setDataGenerator(DataGenerator dataGenerator);
    void saveToKeyStore(CertificateDataDTO certificateDataDTO) throws Exception;
    ArrayList<CertificateDTO> getCertificateChain(String alias);
    Resource prepareCertificateForDownload(DownloadRequestDTO downloadRequest) throws Exception;
    boolean invalidateCertificate(UUID alias);
}
