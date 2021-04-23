import React from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import {Alert, Button, FormControl} from "react-bootstrap";
import axios from "axios";

export default class RegistrationPage extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            passwordStrength : "",
            id:'',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            rePassword : '',
            emailErr: 'Enter email',
            passwordErr: 'Enter password',
            firstNameErr: 'Enter First name',
            lastNameErr: 'Enter Last name',
            rePasswordErr: 'Repeat password',
            validForm: false,
            submitted: false,
            successfullyReg: false,
            disabled: false,
            errorMessage: false,
            blacklistedPasswords: [],
        }
    }

    async componentDidMount() {
        let response = await axios.get('http://localhost:8080/security/passwords');
        if(response && response.status && response.status == 200)
            this.setState({blacklistedPasswords: [...response.data]});
        else
            console.log("No blacklisted passwords.")
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name] : target.value,
        })
        this.validationErrorMessage(event);
    }

    handlePassChange = (event) => {
        this.setState(
            (state,props) => ({ rePassword : event.target.value}),
            () => this.validationErrorMessage(event)
        )
    }

    validationErrorMessage = (event) => {
        const { name, value } = event.target;
        let errors = this.state.errors;

        switch (name) {
            case 'firstName':
                this.setState({
                    firstNameErr : this.checkNameAndSurname(this.state.firstName) ? '' : 'EnterFirstName'
                })
                break;
            case 'lastName':
                this.setState({
                    lastNameErr : this.checkNameAndSurname(this.state.lastName) ? '' : 'EnterLastName'
                })
                break;
            case 'email':
                this.setState({
                    emailErr : this.isValidEmail(this.state.email) && this.state.email.length > 1 ? '' : 'Email is not valid!',
                    //validForm: false,
                })
                break;
            case 'password':
                this.setState({
                    passwordErr : this.checkPassword(this.state.password) ? 'Password must contains at least 8 characters (lowercase letter, capital letter, number and special character) or not be a common password!' : '',
                    //validForm: false,
                })
                break;
            case 'rePassword':
                this.setState({
                    rePasswordErr : this.isValidRepeatedPassword(this.state.rePassword) ? '' : 'This password must match the previous!',
                    //validForm: false,
                })
                break;
            default:
                /*this.setState({
                    validForm: true
                })*/
                break;
        }

    }
    checkNameAndSurname = (value) => {
        if(/^[a-zA-Z ,.'-]+$/.test(value)){
            return true;
        }
        return false;
    }

    checkPassword =  (password) =>{
        if(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)){
            this.setState({
                passwordStrength: this.state.password
            })
            return false;
        }else if(this.state.blacklistedPasswords.includes(password)){
            this.setState({
                passwordStrength: this.state.password
            })
            return false;
        } else {
            this.setState({
                passwordStrength : ""
            })
            return true;
        }
    }

    isValidEmail = (value) => {
        var Proba = !(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i.test(value))
        return Proba;
    }
    isValidRepeatedPassword = (value) => {
        if(this.state.password !== this.state.rePassword) {
            return false;
        }else{
            return  true
        }
    }

    submitForm = async (event) => {
        event.preventDefault();
        const errors = ['email', 'password', 'firstName', 'rePassword', 'lastName'];
        if (this.validateForm(errors)) {
            await this.sendParams()
            this.setState({submitted: true});
        } else {
            console.log('Invalid Form')
        }
    }

    validateForm = (errors) => {
        let valid = true;
        for(const Error of errors) {
            this.validationErrorMessage(this.createTarget(Error));
        }
        //Promeniti!
        if(this.state.emailErr !== "" || this.state.passwordErr !== "" || this.state.firstNameErr !== "" ||
            this.state.lastNameErr !== "" || this.state.rePasswordErr !== "")
            return !valid;
        return valid;
    }

    createTarget = (error) => {
        return {target : {value : error, name : error}}
    }

    async sendParams() {
        axios
            .post('http://localhost:8080/auth/save', {
                'id':'',
                'firstName' : this.state.firstName,
                'lastName' : this.state.lastName,
                'email' : this.state.email,
                'password' : this.state.password,
            })
            .then(res => {
                this.setState({ errorMessage:false });
                this.setState({ successfullyReg:true });
                this.setState( {disabled: !this.state.disabled} )
            }).catch(res => {
            this.setState({ errorMessage:true });
        })

    }

    render() {
        return (
            <div  className="App">
                {/*<h2 id="createCertifiacate"> Create certificate </h2>*/}
                <div className="row">
                    <label className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-5 mb-2">
                        <input  disabled = {(this.state.disabled)? "disabled" : ""} type="text" value={this.state.firstName} name="firstName" onChange={(e) => {
                            this.handleInputChange(e)
                        }} className="form-control" placeholder="First Name"/>
                        {this.state.submitted && this.state.firstNameErr.length > 0 &&
                        <span className="text-danger">{this.state.firstNameErr}</span>}

                    </div>
                    <div className="col-sm-5 mb-2">
                        <input  disabled = {(this.state.disabled)? "disabled" : ""}  type="text" value={this.state.lastName} name="lastName" onChange={(e) => {this.handleInputChange(e) }} className="form-control" placeholder="Last Name"/>
                        {this.state.submitted && this.state.lastNameErr.length > 0 && <span className="text-danger">{this.state.lastNameErr}</span>}

                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>
                <div className="row"style={{marginTop: '1rem'}}>
                    <label  className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-6 mb-2">
                        <input  disabled = {(this.state.disabled)? "disabled" : ""}   type="email" value={this.state.email} name="email" onChange={(e) => {this.handleInputChange(e)}}className="form-control" id="email" placeholder="example@gmail.com" />
                        {this.state.submitted && this.state.emailErr.length > 0 && <span className="text-danger">{this.state.emailErr}</span>}

                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>
                <div className="row"style={{marginTop: '1rem'}}>
                    <label className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-6 mb-2">
                        <FormControl disabled = {(this.state.disabled)? "disabled" : ""}  name="password" type="password" placeholder="Password"  value={this.state.password} onChange={(e) => {this.handleInputChange(e)}}/>
                        {this.state.submitted && this.state.passwordErr.length > 0 &&  <span className="text-danger">{this.state.passwordErr}</span>}
                        <PasswordStrengthBar password={this.state.passwordStrength} />
                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>

                <div className="row" style={{marginTop: '1rem'}}>
                    <label  className="col-sm-2 col-form-label">Repeat password</label>
                    <div className="col-sm-6 mb-2">
                        <FormControl  disabled = {(this.state.disabled)? "disabled" : ""}  name="rePassword" type="password" placeholder="Repeat new Password" value={this.state.rePassword} onChange={(e) => {this.handlePassChange(e)}}/>
                        {this.state.submitted && this.state.rePasswordErr.length > 0 &&  <span className="text-danger">{this.state.rePasswordErr}</span>}

                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>

                {
                    this.state.successfullyReg ?
                        <Alert variant='success' show={true}  style={({textAlignVertical: "center", textAlign: "center"})}>
                            Successfully registered please login.
                        </Alert>
                        :
                        <div className="row" style={{marginTop: '1rem'}}>
                            <div className="col-sm-5 mb-2">
                            </div>
                            <div className="col-sm-4">
                                <Button variant="success" onClick={this.submitForm}>Confirm</Button>
                            </div>
                        </div>
                }

                {
                    this.state.errorMessage &&
                    <Alert variant='danger' show={true}  style={({textAlignVertical: "center", textAlign: "center"})}>
                        The e-mail address must be unique! Please try again
                    </Alert>
                }
            </div>
        );
    }
}