package app.service;

import app.dtos.CertificateDTO;
import app.dtos.CertificateDataDTO;
import app.dtos.DownloadRequestDTO;
import app.model.CertificateCustom;
import app.model.exceptions.ActionNotAllowedException;
import org.springframework.core.io.Resource;

import java.util.List;

public interface CertificateService extends CRUDService<CertificateCustom> {
    List<CertificateDTO> findAllInKeystores();
    List<CertificateDTO> findAllRootInterCertificates();
    void setDataGenerator(DataGenerator dataGenerator);
    void saveToKeyStore(CertificateDataDTO certificateDataDTO) throws Exception;

    Resource prepareCertificateForDownload(DownloadRequestDTO downloadRequest) throws Exception;
}
