import axios from 'axios'
import fileDownload from 'js-file-download'

class CertificateService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: "http://localhost:8080/api/certificate"
        })
    }

    async downloadCertificate(data, jwt) {
        const headers = {
            Authorization: 'Bearer ' + jwt,
            responseType: 'arraybuffer',
        }
        const response = this.apiClient
            .post('/download', data, {
                headers
            })
            .then(response => {
                console.log(response)
                fileDownload(response.data, 'certificate.cer')
            })
            .catch(err => {
                return err.response
            })
        return response
    }

    async invalidateCertificate(alias, jwt) {
        const headers = this.setupHeaders(jwt)
        console.log(headers)
        const response = this.apiClient
            .post(`/invalidate/${alias}`, {
                headers
            })
            .then(response => {
                return response
            })
            .catch(err => {
                return err.response
            })
        return response
    }


    setupHeaders(jwt) {
        const headers = {
            Accept: 'application/json',
            Authorization: 'Bearer ' + jwt
        }
        return headers
    }

}

const certificateService = new CertificateService()

export default certificateService;