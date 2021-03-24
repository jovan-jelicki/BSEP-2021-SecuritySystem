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
                purpose:'Please choose certificate key usages',
                issuer:'Please choose certificate issuer'
            },
            dateStart:'',
            dateEnd:'',
            validForm: false,
            submitted: false,
            certificateIssuers:[],
            purposes:[],
            boolDates:false,
            boolPurposes:false,
            keyUsages:[],
            indexArray:[],
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
            .get("http://localhost:8080/api/certificate/getRootInter",
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
        console.log(this.state.certificate.startDate)
        console.log(this.state.certificate.endDate)
        axios
            .post("http://localhost:8080/api/certificate/issueRootIntermediate",{
                    'issuerAlias':this.state.certificate.issuer,
                    'c':this.state.certificate.country,
                    's':this.state.certificate.stateProvince,
                    'o':this.state.certificate.organizationName,
                    'ou':this.state.certificate.organizationalUnit,
                    'cn':this.state.certificate.commonName,
                    'e':this.state.certificate.email,
                    'startDate':this.state.certificate.startDate,
                    'endDate':this.state.certificate.endDate,
                    'keyUsage':this.state.certificate.purpose,

                },
                {  headers: {
                        'Content-Type': 'application/json',
                        Authorization : 'Bearer ' + this.state.user.jwtToken
                    }})
            .then(res => {
                alert("Successfully!")
                window.location = '/profile';
                //href="/profile"
               // this.props.history.push('/profile');

            })
            .catch(res => {
                alert("Something went wrong!")
            })


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
                errors.purpose = value.length < 1 ? 'Choose certificate key usages' : '';
                break;
            case 'email':
                errors.email = this.isValidEmail(value) ? '' : 'Email is not valid!';
                break;
            default:
                break;
        }

        this.setState({ errors });
    }
    validateIssuer=()=>{
        let errors = this.state.errors;
        errors.issuer = this.state.certificate.issuer.length < 1 ? 'Choose certificate issuer' : '';
    }

    isValidEmail = (value) => {
        return !(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i.test(value))
    }

    checkDates=()=>{
        let errors = this.state.errors;
        if(this.state.certificate.startDate>this.state.certificate.endDate){
            errors.endDate =  'The End Date must come after the Start Date';
            return false;
        }
        return true;
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
        if (this.validateIssuer() && this.validateForm(this.state.errors) && this.checkDates()) {
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
            boolDates: false,
            boolPurposes:false
        })
        let errors = this.state.errors;
    }

      setStartAndEndDate=(event)=>{
         if (this.state.certificateIssuers.length && this.state.certificate.issuer!="") {
             this.state.certificateIssuers.forEach(v => {
                 if(v.alias===this.state.certificate.issuer) {
                     if (new Date(v.validFrom)>= new Date()) {//new Date(v.validTo) > new Date() && new Date(v.validFrom) < new Date(v.validTo)) {
                         this.setState({
                             boolDates: true,
                             dateStart: v.validFrom,
                             dateEnd: v.validTo,
                             keyUsages: v.keyUsage,
                             boolPurposes:true

                         });
                     }else if (new Date(v.validFrom) < new Date() && new Date(v.validTo) > new Date() && new Date(v.validFrom) < new Date(v.validTo)) {
                         this.setState({
                             boolDates: true,
                             dateStart:String(new Date()),
                             dateEnd: v.validTo,
                             keyUsages: v.keyUsage,
                             boolPurposes:true
                         });
                     }else if(new Date(v.validFrom)< new Date() && new Date(v.validTo)< new Date()) {
                         this.setState({
                             boolDates: true,
                             dateStart: moment(new Date()).format('DD.MM.YYYY'),
                             dateEnd: moment(new Date()).format('DD.MM.YYYY'),
                             keyUsages: v.keyUsage,
                             boolPurposes:true
                         });
                     }
                 }
             });
         }else{
             let errors = this.state.errors;
             errors.purpose = 'Choose certificate key usages';
         }

         console.log(this.state.dateStart)
         console.log(this.state.dateEnd)
         console.log(this.state.keyUsages)
    }

    onTypeChange=(event) => {
        var option = event.target.id
        console.log(option)
        let purp=[]
        let index=[]
        purp=this.state.purposes

        if (event.target.checked===false){
            this.state.indexArray.forEach(p => {
                if(p!=event.target.id){
                    index.push(p);
                }else{
                    purp[p]=false;
                }
            })
        }else {
            index=this.state.indexArray
            index.push(event.target.id)
        }


        for (var i = 0, l=index.length;i<l ; i++)
        {
            for (var j = 0, l = 9; j < l; j++) {
                if (j == index[i]) {
                    purp[j] = true;
                } else if(purp[j]!=true) {
                    purp[j] = false;
                }
            }
        }

        this.setState({
            certificate : {
                ...this.state.certificate,
                purpose : purp
            },
            indexArray:index
        })
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
                                <option disabled={false}  selected="selected">Choose by serial number</option>
                                {this.state.certificateIssuers.map(certificate =>
                                    <option key={certificate.alias} value={certificate.alias}>{certificate.serialNumber}</option>
                                )}
                            </Form.Control>
                            {this.state.submitted && this.state.errors.issuer.length > 0 && <span className="text-danger">{this.state.errors.issuer}</span>}

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
                            <td> Choose period and key usages</td>
                            <td>
                                <Button variant="outline-primary" onClick={this.setStartAndEndDate}>Choose</Button>
                                <br/>
                                {/* {this.state.errors.issuer.length > 0 && <span className="text-success">{this.state.errors.issuer}</span>}
*/}
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
                                        minDate={this.state.certificate.startDate} maxDate={new Date(this.state.dateEnd)} onChange={(e) => {
                                this.setEndDate(e)
                            }}/>
                            {this.state.endDate}
                            {this.state.submitted && this.state.errors.endDate.length > 0 &&
                            <span className="text-danger">{this.state.errors.endDate}</span>}

                        </td>
                    </tr>
                    }
                    { this.state.boolPurposes &&
                    <tr>
                        <td>Key usages</td>
                        <td>
                            <fieldset>
                                <Form >
                                    <Form.Group as={Col}  >
                                        <Row sm={35} >
                                            {this.state.keyUsages[7] && <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="encipherOnly"  name="purpose" id="0" onChange={this.onTypeChange} />}
                                            {this.state.keyUsages[6] && <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="cRLSign"  name="purpose" id="1" onChange={this.onTypeChange} />}
                                            {this.state.keyUsages[5] && <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="keyCertSign"  name="purpose" id="2" onChange={this.onTypeChange} />}
                                            {this.state.keyUsages[4] && <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="keyAgreement"  name="purpose" id="3" onChange={this.onTypeChange} />}
                                            {this.state.keyUsages[3] && <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="dataEncipherment"  name="purpose" id="4" onChange={this.onTypeChange} />}
                                            {this.state.keyUsages[2] && <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="keyEncipherment"  name="purpose" id="5" onChange={this.onTypeChange} />}
                                            {this.state.keyUsages[1] && <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="nonRepudiation"  name="purpose" id="6" onChange={this.onTypeChange} />}
                                            {this.state.keyUsages[0] && <Form.Check multiple style={{'marginLeft':'1rem'}} type="checkbox" label="digitalSignature"  name="purpose" id="7" onChange={this.onTypeChange} />}
                                      </Row>
                                    </Form.Group>
                                </Form>
                            </fieldset>
                            {this.state.submitted && this.state.errors.purpose.length > 0 && <span className="text-danger">{this.state.errors.purpose}</span>}
                        </td>
                    </tr>
                        }
                    </tbody>
                </Table>
                <div  style={{textAlign:"center",display:"inline-block", marginBottom:40}}>
                    <Button  variant="primary" onClick={this.submitForm}>Confirm</Button>
                </div>
            </div>
        );
    }
}