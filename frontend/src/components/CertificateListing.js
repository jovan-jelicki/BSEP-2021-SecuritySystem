import * as React from "react";
import moment from "moment";
import {Button, Table} from "react-bootstrap";
import axios from "axios";


export default class CertificateListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : !!localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
            certificates : [],
            search : []
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
                <td> <Button onClick={() => this.showDetails(certificate)}>Details</Button></td>
                {this.state.user.role === "ROLE_admin" && <td><Button onClick={() => this.invalidate(certificate)}> Invalidate </Button></td>}
            </tr>
        );
        return (
            <div >
                <br/>
                <h2 id={"certificates"} style={{textDecorationLine:'underline'}}> Certificates </h2>
                <br/>
                <div style={{overflowY: "auto", height : "500px"}}>
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
                          {/*{this.showModal()}*/}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }

    showDetails = () => {

    }

    invalidate = () => {

    }

}