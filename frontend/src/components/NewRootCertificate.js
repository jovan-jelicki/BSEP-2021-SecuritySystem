import * as React from "react";
import {Button, Col, Nav, Navbar, Table} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class NewRootCertificate extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            certificate:{
                country: '',
                stateProvince:'',
                localityName:'',
                organizationName:'',
                organizationalUnit:'',
                commonName:'',
                startDate:'',
                endDate:''
            },
            errors:{
                    country: 'Please enter country name',
                    stateProvince: 'Please enter state or province name',
                    localityName: 'Please enter locality name',
                    organizationName: 'Please enter organization name',
                    organizationalUnit: 'Please enter organizational unit',
                    commonName:'Please enter common name',
                    startDate: 'Please choose certificate start date',
                    endDate:'Please choose certificate end date'

            },
            dateStart:'',
            dateEnd:'',
            validForm: false,
            submitted: false,
        }
    }

    handleInputChange = (event) => {
        console.log(event.target.value)
        const { name, value } = event.target;
        const certificate = this.state.certificate;
        certificate[name] = value;
        this.setState({ certificate });

        this.validationErrorMessage(event);
    }

    validationErrorMessage = (event) => {
        const { name, value } = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'country':
                errors.country = value.length != 2 ? 'Enter Country Name (2 letter code)' : '';
                break;
            case 'stateProvince':
                errors.stateProvince = value.length < 1 ? 'Enter State or Province Name' : '';
                break;
            case 'localityName':
                errors.localityName = value.length < 1 ? 'Enter Locality Name' : '';
                break;
            case 'organizationName':
                errors.organizationName = value.length < 1 ? 'Enter Organization Name' : '';
                break;
            case 'organizationalUnit':
                errors.organizationalUnit = value.length < 1 ? 'Enter Organizational Unit' : '';
                break;
            case 'commonName':
                errors.commonName = value.length < 1 ? 'Enter Common Name' : '';
                break;

            default:
                break;
        }

        this.setState({ errors });
    }



    validateForm = (errors) => {
        let valid = true;
        Object.entries(errors).forEach(item => {
            console.log(item)
            item && item[1].length > 0 && (valid = false)
        })
        return valid;
    }

    submitForm =  (event) => {
        this.state.certificate.startDate=this.state.dateStart;
        this.state.certificate.endDate=this.state.dateEnd;
        this.setState({ submitted: true });
        const certificate = this.state.certificate;
        console.log(this.state.certificate)

        event.preventDefault();
        if (this.validateForm(this.state.errors)) {
            console.info('Valid Form')
        } else {
            console.log('Invalid Form')
        }
        console.log(this.state.certificate)

    }

    setStartDate = (date) => {
        this.setState({
            dateStart : date
        })
        this.validationDateMessage('start',date)
    }

    setEndDate = (date) => {
        this.setState({
            dateEnd : date
        })
        this.validationDateMessage('end',date)
    }

    validationDateMessage=(type,date)=>{
        let errors = this.state.errors;
        if(type=='start') {
            errors.startDate = date.length < 1 ? 'Choose certificate start date' : '';
        }else{
                errors.endDate = date.length < 1 ? 'Choose certificate end date' : '';
        }
        this.setState({ errors });

    }
    render() {
        return (
            <div >
                <Table  hover variant="dark">
                    <tbody>
                    <tr>
                        <td> Country Name </td>
                        <td>
                            <input type="text" value={this.state.certificate.country} name="country" onChange={(e) => {this.handleInputChange(e)}} className="form-control" id="cn" placeholder="2 letter code" />
                            {this.state.submitted && this.state.errors.country.length > 0 && <span className="text-danger">{this.state.errors.country}</span>}
                        </td>
                    </tr>
                    <tr>
                        <td>State or Province Name</td>
                        <td>
                            <input type="text" value={this.state.certificate.stateProvince} name="stateProvince" onChange={(e) => {this.handleInputChange(e)}} className="form-control" id="cn" placeholder="full name" />
                            {this.state.submitted && this.state.errors.stateProvince.length > 0 && <span className="text-danger">{this.state.errors.stateProvince}</span>}
                        </td>
                    </tr>
                    <tr>
                        <td> Locality Name</td>
                        <td>
                            <input type="text" value={this.state.certificate.localityName} name="localityName" onChange={(e) => {this.handleInputChange(e)}} className="form-control" id="cn" placeholder=" city" />
                            {this.state.submitted && this.state.errors.localityName.length > 0 && <span className="text-danger">{this.state.errors.localityName}</span>}
                        </td>
                    </tr>
                    <tr>
                        <td> Organization Name</td>
                        <td>
                            <input type="text" value={this.state.certificate.organizationName} name="organizationName" onChange={(e) => {this.handleInputChange(e)}} className="form-control" id="cn" placeholder="company" />
                            {this.state.submitted && this.state.errors.organizationName.length > 0 && <span className="text-danger">{this.state.errors.organizationName}</span>}
                        </td>
                    </tr>
                    <tr>
                        <td>  Organizational Unit Name</td>
                        <td>
                            <input type="text" value={this.state.certificate.organizationalUnit} name="organizationalUnit" onChange={(e) => {this.handleInputChange(e)}} className="form-control" id="cn" placeholder="section" />
                            {this.state.submitted && this.state.errors.organizationalUnit.length > 0 && <span className="text-danger">{this.state.errors.organizationalUnit}</span>}
                        </td>
                    </tr>
                    <tr>
                        <td> Common Name </td>
                        <td>
                            <input type="text" value={this.state.certificate.commonName} name="commonName" onChange={(e) => {this.handleInputChange(e)}} className="form-control" id="cn" placeholder="server FQDN or YOUR name" />
                            {this.state.submitted && this.state.errors.commonName.length > 0 && <span className="text-danger">{this.state.errors.commonName}</span>}
                        </td>
                    </tr>
                    <tr>
                        <td>Start date </td>
                        <td>
                            <DatePicker selected={this.state.dateStart}  name="dateStart" minDate={new Date()}  onChange={(e) => {this.setStartDate(e)}}  />
                            {this.state.submitted && this.state.errors.startDate.length > 0 && <span className="text-danger">{this.state.errors.startDate}</span>}

                        </td>
                    </tr>
                    <tr>
                        <td>End date </td>
                        <td>
                            <DatePicker  selected={this.state.dateEnd}  name="dateEnd" minDate={this.state.dateStart}  onChange={(e) => {this.setEndDate(e)}}/>
                            {this.state.submitted && this.state.errors.endDate.length > 0 && <span className="text-danger">{this.state.errors.endDate}</span>}

                        </td>
                    </tr>
                    </tbody>
                </Table>
                    <div  style={{textAlign:"center",display:"inline-block", marginBottom:40}}>
                        <Button  variant="primary" onClick={this.submitForm}>Confirm</Button>
                    </div>
            </div>
        );
    }
}