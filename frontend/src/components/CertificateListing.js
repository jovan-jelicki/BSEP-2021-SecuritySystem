import * as React from "react";
import moment from "moment";
import {Button, Modal, Table} from "react-bootstrap";
import axios from "axios";
import CertificateDetails from "./CertificateDetails";
import CertificatePath from "./CertificatePath";


export default class CertificateListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : !!localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
            certificates : [],
            search : [],
            showModal : false,
            certificate : {},
            modalTab : "details"
        }
    }
    componentDidMount() {
        axios
            .get("http://localhost:8080/api/certificate",
                {  headers: {
                        'Content-Type': 'application/json',
                        Authorization : 'Bearer ' + this.state.user.jwtToken
                    }})
            .then(res => {
                this.setState({
                    certificates : res.data,
                    search : res.data
                })
            })
            .catch(res => {
                alert("Something went wrong!")
            })
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
                {this.state.user.role === "ROLE_admin" && <td><Button onClick={() => this.invalidate(certificate)}> Invalidate </Button></td>}
            </tr>
        );
        return (
            <div >
                <br/>
                <h2 id={"certificates"}> Certificates </h2>
                <br/>
                <div style={{overflowY: "auto", height : "300px"}}>
                    <Table style={{"borderWidth":"1px", 'borderColor':"#aaaaaa", 'borderStyle':'solid'}} responsive striped bordered hover size="sm" variant="dark" >
                        <tbody>
                        <tr>
                            <th>Serial number</th>
                            <th>Subject name</th>
                            <th>Issuer name</th>
                            <th>Valid from</th>
                            <th>Valid to</th>
                            <th>Show details</th>
                            {this.state.user.role === "ROLE_admin" && <th> Invalidate </th> }
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
                <Modal.Header closeButton onClick={() => this.setState({showModal : false, modalTab : "", certificate : {}})} style={{'background':'gray'}}>
                    <Modal.Title>Certificate details</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{'background':'lightgray'}}>
                    <Button variant={"secondary"} onClick={this.showDetails}>Details </Button>
                    <Button variant={"secondary"} onClick={this.showPath}>Certification path </Button>
                    <hr className="mt-2 mb-4"/>
                    {this.state.modalTab === "details" && <CertificateDetails certificate={this.state.certificate}></CertificateDetails>}
                    {this.state.modalTab === "path" && <CertificatePath></CertificatePath>}
                </Modal.Body>
                <Modal.Footer style={{'background':'gray'}}>
                    <Button variant="primary" onClick={() => this.setState({showModal : false, modalTab : "" , certificate : {}})}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    showDetails = () => {
        this.setState({
            modalTab : "details",
            showModal : true,
            certificate : this.state.certificate
        })
    }

    showPath = () => {
        this.setState({
            modalTab : "path",
            showModal : true,
            certificate : this.state.certificate
        })
    }
    handleModal=(certificate)=>{
        this.setState({
            showModal : !this.state.showModal,
            certificate : certificate,
            modalTab : "details"
        });
    }

    invalidate = () => {

    }

}