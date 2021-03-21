import * as React from "react";
import {Button, Col, Form, FormControl, Modal, Row, Table} from "react-bootstrap";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment";


export default class NewInterCertificate extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            certificate:{
                issuer:'',
                country: '',
                stateProvince:'',
                organizationName:'',
                organizationalUnit:'',
                commonName:'',
                email:'',
                startDate:'',
                endDate:'',
                purpose:''

            },
            errors:{
                country: 'Please enter country name',
                stateProvince: 'Please enter state or province name',
                organizationName: 'Please enter organization name',
                organizationalUnit: 'Please enter organizational unit',
                commonName:'Please enter common name',
                email:'Please enter email address',
                startDate: 'Please choose certificate start date',
                endDate:'Please choose certificate end date',
                purpose:'Please enter certificate purpose'
            },
            dateStart:'',
            dateEnd:'',
            validForm: false,
            submitted: false,
            certificateIssuers:[],
            purposes:[],
            boolDates:false,
            user : !!localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},

        }
    }

    async componentDidMount() {
        this.fetchCertificates()
       // this.fetchDates()
        console.log(this.state.boolDates)
    }

    fetchDates=()=>{
        this.setState({
            boolDates : false,
        })
    }
    fetchCertificates=()=>{
        axios
            .get("http://localhost:8080/api/certificate",
                {  headers: {
                        'Content-Type': 'application/json',
                        Authorization : 'Bearer ' + this.state.user.jwtToken
                    }})
            .then(res => {
                this.setState({
                    certificateIssuers : res.data,
                })
            })
            .catch(res => {
                alert("Something went wrong!")
            })
    }

    sendData=()=>{
     /*   axios
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

      */
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
            case 'organizationName':
                errors.organizationName = value.length < 1 ? 'Enter Organization Name' : '';
                break;
            case 'organizationalUnit':
                errors.organizationalUnit = value.length < 1 ? 'Enter Organizational Unit' : '';
                break;
            case 'commonName':
                errors.commonName = value.length < 1 ? 'Enter Common Name' : '';
                break;
            case 'purpose':
                errors.purpose = value.length < 1 ? 'Choose certificate purpose' : '';
                break;
            case 'email':
                errors.email = this.isValidEmail(value) ? '' : 'Email is not valid!';
                break;
            default:
                break;
        }

        this.setState({ errors });
    }

    isValidEmail = (value) => {
        return !(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i.test(value))
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
        this.setState({ submitted: true });
        const certificate = this.state.certificate;
        console.log(this.state.certificate)

        event.preventDefault();
        if (this.validateForm(this.state.errors)) {
            console.info('Valid Form')
            this.sendData();
        } else {
            console.log('Invalid Form')
        }
        console.log(this.state.certificate)
    }

    setStartDate = (date) => {
        this.setState({
            certificate : {
                ...this.state.certificate,
                startDate : date
            }
        })
        this.validationDateMessage('start',date)
    }

    setEndDate = (date) => {
        this.setState({
            certificate : {
                ...this.state.certificate,
                endDate : date
            }
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

    handleSelectedIssuer =  (event) => {
        const target = event.target;
        let value = event.target.value;

        this.setState({
            certificate : {
                ...this.state.certificate,
                issuer : value
            },
            boolDates: false
        })
    }

      setStartAndEndDate=(event)=>{
         if (this.state.certificateIssuers.length) {
             this.state.certificateIssuers.forEach(v => {
                 if(v.alias===this.state.certificate.issuer) {
                     if (new Date(v.validFrom)> new Date() && new Date(v.validTo) > new Date() && new Date(v.validFrom) < new Date(v.validTo)) {
                         this.setState({
                             boolDates: true,
                             dateStart: v.validFrom,
                             dateEnd: v.validTo
                         });
                     }else if (new Date(v.validFrom) < new Date() && new Date(v.validTo) > new Date() && new Date(v.validFrom) < new Date(v.validTo)) {
                         this.setState({
                             boolDates: true,
                             dateStart:String(new Date()),
                             dateEnd: v.validTo
                         });
                     }else if(new Date(v.validFrom)< new Date() && new Date(v.validTo)< new Date()) {
                         this.setState({
                             boolDates: true,
                             dateStart: moment(new Date()).format('DD.MM.YYYY'),
                             dateEnd: moment(new Date()).format('DD.MM.YYYY')
                         });
                     }
                 }
             });
         }

         console.log(this.state.dateStart)
         console.log(this.state.dateEnd)
    }

    onTypeChange=(event) => {
        var option = event.target.id
        console.log(event.target.checked)
        //console.log(event.target.value)
        let purp=[]
        purp=this.state.purposes

        let final=[]

        if (event.target.checked===false){
            purp.forEach(p => {
                if(p!=event.target.value){
                    final.push(p);
                }
            })
        }else {
            final=this.state.purposes
            final.push(event.target.value)
        }

        this.setState({
            certificate : {
                ...this.state.certificate,
                purpose : final
            }
        })
        this.state.type = option;
        console.log(this.state.certificate)
        this.validationErrorMessage(event);
    }

    render() {
        return (
            <div>
                <h5 style={{color:'#455A64'}}>New Intermediate certificate</h5>
                <Table  hover variant="dark">
                    <tbody>
                    <tr>
                        <td style={{width:200}}>  Certificate issuer </td>
                        <td>
                            <Form.Control placeholder="Certificates" as={"select"} value={this.state.certificate.issuer}  onChange={this.handleSelectedIssuer} >
                                <option disabled={true}  selected="selected">Choose by serial number</option>
                                {this.state.certificateIssuers.map(certificate =>
                                    <option key={certificate.alias} value={certificate.alias}>{certificate.serialNumber}</option>
                                )}
                            </Form.Control>
                        </td>
                    </tr>
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
                        <td> Email</td>
                        <td>
                            <input type="text" value={this.state.certificate.email} name="email" onChange={(e) => {this.handleInputChange(e)}} className="form-control" id="cn" placeholder="example@gmail.com" />
                            {this.state.submitted && this.state.errors.email.length > 0 && <span className="text-danger">{this.state.errors.email}</span>}
                        </td>
                    </tr>
                    { !this.state.boolDates &&
                        <tr>
                            <td> Choose period</td>
                            <td>
                                <Button onClick={this.setStartAndEndDate}>Choose</Button>
                            </td>
                        </tr>
                    }
                    { this.state.boolDates &&
                        <tr>
                            <td>Start date</td>
                            <td>

                                <DatePicker selected={this.state.certificate.startDate} name="date1"
                                            minDate={new Date(this.state.dateStart)} maxDate={new Date(this.state.dateEnd)} onChange={(e) => {
                                    this.setStartDate(e)
                                }}/>
                                {this.state.submitted && this.state.errors.startDate.length > 0 &&
                                <span className="text-danger">{this.state.errors.startDate}</span>}

                            </td>
                        </tr>
                    }
                    {this.state.boolDates &&
                    <tr>
                        <td>End date</td>
                        <td>
                            <DatePicker selected={this.state.certificate.endDate} name="date2"
                                        minDate={new Date(this.state.dateStart)} maxDate={new Date(this.state.dateEnd)} onChange={(e) => {
                                this.setEndDate(e)
                            }}/>
                            {this.state.endDate}
                            {this.state.submitted && this.state.errors.endDate.length > 0 &&
                            <span className="text-danger">{this.state.errors.endDate}</span>}

                        </td>
                    </tr>
                    }
                    <tr>
                        <td>Purposes</td>
                        <td>
                            <fieldset>
                                <Form >
                                    <Form.Group as={Col}  >
                                        <Row sm={35} >
                                            <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="Proves your identity to a remote computer" value={"Proves your identity to a remote computer"} name="purpose" id="1" onChange={this.onTypeChange} />
                                            <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="Ensures the identity of a remote computer" value={"Ensures the identity of a remote computer"} name="purpose" id="2" onChange={this.onTypeChange} />
                                            <Form.Check multiple  style={{'marginLeft':'1rem'}} type="checkbox" label="Ensures software came from software publisher" value={"Ensures software came from software publisher"}  name="purpose" id="3" onChange={this.onTypeChange} />
                                            <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="Protects software from alteration after publication" value={"Protects software from alteration after publication"} name="purpose" id="4" onChange={this.onTypeChange} />
                                            <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="Protects e-mail messages" value={"Protects e-mail messages"} name="purpose" id="5" onChange={this.onTypeChange} />
                                            <Form.Check multiple  style={{'marginLeft':'1rem'}} type="checkbox" label="Allows data on disk to be encrypted" value={"Allows data on disk to be encrypted"}  name="purpose" id="6" onChange={this.onTypeChange} />
                                            <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="2.23.140.1.2.2" value={"2.23.140.1.2.2"} name="purpose" id="8" onChange={this.onTypeChange} />
                                            <Form.Check multiple  style={{'marginLeft':'1rem'}} type="checkbox" label="2.16.840.1.114412.1.1" value={"2.16.840.1.114412.1.1"}  name="purpose" id="7" onChange={this.onTypeChange} />
                                            <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="All issuance policies" value={"All issuance policies"} name="purpose" id="9" onChange={this.onTypeChange} />

                                        </Row>
                                    </Form.Group>
                                </Form>
                            </fieldset>
                            {this.state.submitted && this.state.errors.purpose.length > 0 && <span className="text-danger">{this.state.errors.purpose}</span>}
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