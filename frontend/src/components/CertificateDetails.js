import * as React from "react";
import {Table} from "react-bootstrap";

export default class CertificateDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details : "Proba"
        }
    }

    render() {
        return(
            <div>
                <div style={{overflowY: "auto",overflowX: "hidden", height : "300px"}}>
                    <Table  hover variant="dark">
                        <tbody>
                        <tr onClick={() => this.changeSimpleData(this.props.certificate.serialNumber)}>
                            <td style={{whiteSpace : "nowrap"}}> Serial number</td>
                            <td>{this.props.certificate.serialNumber}</td>
                        </tr>
                        <tr onClick={() => this.changeJsonData(this.props.certificate.subjectData)}>
                            <td style={{whiteSpace : "nowrap"}}> Subject </td>
                            <td>{this.props.certificate.subjectData.name}</td>
                        </tr>
                        <tr onClick={() => this.changeJsonData(this.props.certificate.issuerData)}>
                            <td style={{whiteSpace : "nowrap"}}> Issuer </td>
                            <td>{this.props.certificate.issuerData.name}</td>
                        </tr>
                        <tr onClick={() => this.changeSimpleData(this.props.certificate.publicKey)}>
                            <td style={{whiteSpace : "nowrap"}}> Public key</td>
                            <td>{this.props.certificate.publicKey}</td>
                        </tr>
                        <tr onClick={() =>  this.changeSimpleData(this.props.certificate.validFrom)}>
                            <td style={{whiteSpace : "nowrap"}}> Valid from</td>
                            <td>{this.props.certificate.validFrom}</td>
                        </tr>
                        <tr onClick={() =>  this.changeSimpleData(this.props.certificate.validTo)}>
                            <td style={{whiteSpace : "nowrap"}}> Valid to</td>
                            <td>{this.props.certificate.validTo}</td>
                        </tr>


                        </tbody>
                    </Table>
                </div>
                <div style={{overflowY: "auto", height : "100px", border : "5px ridge"}} >
                    <text style={{whiteSpace : "pre-wrap", wordBreak : "break-word"}}>
                    {this.state.details}
                    </text>
                </div>
            </div>
        );
    }
    changeSimpleData = (details) => {
        this.setState({
            details : details
        })
    }

    changeJsonData = (details) => {
        let Pom = "";
        for (var key of Object.keys(details)) {
            Pom += key + " = " + details[key] + ", ";
        }
        this.setState({
            details : Pom
        })
    }

}
