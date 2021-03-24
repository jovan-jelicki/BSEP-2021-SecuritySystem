import * as React from "react";
import {Table} from "react-bootstrap";

export default class CertificateDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details : ""
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
                        <tr onClick={() => this.showKeyUsage(this.props.certificate.keyUsage)}>
                            <td style={{whiteSpace : "nowrap"}}> KeyUsage</td>
                            <td> </td>
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
    showKeyUsage = (keyUsage) =>{
        let Ret = "";
        for(var j = 0, l = 9; j < l; j++){
            if(j === 0 && keyUsage[j])
                Ret += "digitalSignature, ";
            else if(j === 1 && keyUsage[j])
                Ret += "nonRepudiation, ";
            else if(j === 2 && keyUsage[j])
                Ret += "keyEncipherment, ";
            else if(j === 3 && keyUsage[j])
                Ret += "dataEncipherment, ";
            else if(j === 4 && keyUsage[j])
                Ret += "keyAgreement, ";
            else if(j === 5 && keyUsage[j])
                Ret += "keyCertSign, ";
            else if(j === 6 && keyUsage[j])
                Ret += "cRLSign, ";
            else if(j === 7 && keyUsage[j])
                Ret += "encipherOnly, ";
        }
        this.setState({
            details : Ret
        })
    }

}
