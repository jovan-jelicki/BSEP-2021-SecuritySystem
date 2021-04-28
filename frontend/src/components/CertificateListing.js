import * as React from "react";
import moment from "moment";
import axios from "axios";
import CertificateDetails from "./CertificateDetails";
import CertificatePath from "./CertificatePath";
import CertificateService from './../services/CertificateService'
import { Button, Modal, Table } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
import { connect } from 'react-redux';


class CertificateListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            certificates: [],
            search: [],
            showModal: false,
            certificate: {},
            modalTab: "details"
        }
    }
    componentDidMount() {
        if(this.props.user.role === "ROLE_admin")
            axios
                .get("https://localhost:8443/api/certificate",
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.props.jwt
                        }
                    })
                .then(res => {
                    this.setState({
                        certificates: res.data,
                        search: res.data
                    })
                })
                .catch(res => {
                    alert("Something went wrong!")
                })
        else {
            axios
                .get("https://localhost:8443/api/certificate/findAllUsersCertificate/" + this.props.user.email,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + this.props.jwt
                        }
                    })
                .then(res => {
                    this.setState({
                        certificates: res.data,
                        search: res.data
                    })
                })
                .catch(res => {
                    alert("Something went wrong!")
                })
        }
    }

    async downloadCertificate(certificateAlias) {
        const userEmail = this.props.user.email;
        const downloadData = { userEmail, certificateAlias };
        const response = await CertificateService.downloadCertificate(downloadData, this.props.jwt)
    }

    async invalidate(certificateAlias) {
        const response = await CertificateService.invalidateCertificate(certificateAlias, this.props.jwt)
        if (response.status) {
            if (response.status == 200)
                alert(`Sucessfully invalidated ${certificateAlias}!`);
            else
                alert(`An error occurred while invalidating ${certificateAlias}.`)
                
            window.location.reload(true)
        }
    }

    render() {
        const Certificates = this.state.search.map((certificate, key) =>
            <tr>
                <td>{certificate.serialNumber}</td>
                <td>{certificate.subjectData.name}</td>
                <td>{certificate.issuerData.name}</td>
                <td>{moment(certificate.validFrom).format('DD.MM.YYYY')}</td>
                <td>{moment(certificate.validTo).format('DD.MM.YYYY ')}</td>
                <td> <Button onClick={() => this.handleModal(certificate)}>Details</Button></td>
                <td> <Button onClick={() => this.downloadCertificate(certificate.alias)}><FaDownload /></Button></td>
                {this.props.user.role === "ROLE_admin" && <td><Button onClick={() => this.invalidate(certificate.alias)}> Invalidate </Button></td>}
            </tr>
        );
        return (
            <div >
                <br />
                <h2 id={"certificates"} style={{ textDecorationLine: 'underline' }}> Certificates </h2>
                <br />
                <div style={{ overflowY: "auto", height: "500px" }}>
                    <Table style={{ "borderWidth": "1px", 'borderColor': "#aaaaaa", 'borderStyle': 'solid' }} responsive striped bordered hover size="sm" variant="dark" >
                        <tbody>

                            <tr>
                                <th>Serial number</th>
                                <th>Subject name</th>
                                <th>Issuer name</th>
                                <th>Valid from</th>
                                <th>Valid to</th>
                                <th>Show details</th>
                                <th>Download</th>
                                {this.props.user.role === "ROLE_admin" && <th> Invalidate </th>}
                            </tr>
                            {Certificates}
                            {this.showModal()}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }

    showModal = () => {
        return (
            <Modal show={this.state.showModal}   >
                <Modal.Header closeButton onClick={() => this.setState({ showModal: false, modalTab: "", certificate: {} })} style={{ 'background': 'gray' }}>
                    <Modal.Title>Certificate details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ 'background': 'lightgray' }}>
                    <Button variant={"secondary"} onClick={this.showDetails}>Details </Button>
                    <Button variant={"secondary"} onClick={this.showPath}>Certification path </Button>
                    <hr className="mt-2 mb-4" />
                    {this.state.modalTab === "details" && <CertificateDetails certificate={this.state.certificate}></CertificateDetails>}
                    {this.state.modalTab === "path" && <CertificatePath certificate={this.state.certificate}></CertificatePath>}
                </Modal.Body>
                <Modal.Footer style={{ 'background': 'gray' }}>
                    <Button variant="primary" onClick={() => this.setState({ showModal: false, modalTab: "", certificate: {} })}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    showDetails = () => {
        this.setState({
            modalTab: "details",
            showModal: true,
            certificate: this.state.certificate
        })
    }

    showPath = () => {
        this.setState({
            modalTab: "path",
            showModal: true,
            certificate: this.state.certificate
        })
    }
    handleModal = (certificate) => {
        this.setState({
            showModal: !this.state.showModal,
            certificate: certificate,
            modalTab: "details"
        });
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        jwt: state.jwt,
    };
};

export default connect(mapStateToProps)(CertificateListing);