import React from 'react';
import {Alert, Button, FormControl} from "react-bootstrap";
import axios from "axios";

export default class RegistrationPage extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            user: {
                id:'',
                email: '',
                password: '',
                firstName: '',
                lastName: '',
            },
            errors:{
                user: {
                    'email': 'Enter email',
                    'password': 'Enter password',
                    'firstName': 'Enter First name',
                    'lastName': 'Enter Last name',
                    'rePassword' : 'Repeat password'
                }
            },
            validForm: false,
            submitted: false,
            successfullyReg:false,
            disabled: false,
            errorMessage:false
        }
    }

    handleInputChange = (event) => {
        //console.log(event.target.value)
        const { name, value } = event.target;
        const user = this.state.user;
        user[name] = value;

        this.setState({ user });
       // console.log(this.state.user.password)

        this.validationErrorMessage(event);
    }

    handlePassChange = (event) => {
       // console.log("dosao")
       // console.log(event.target.value)
        this.state.rePassword=event.target.value;
        //console.log(this.state.rePassword)
        this.validationErrorMessage(event);
    }

    validationErrorMessage = (event) => {
        const { name, value } = event.target;
        let errors = this.state.errors;

        switch (name) {
            case 'firstName':
                errors.user.firstName = value.length < 1 ? 'Enter First Name' : '';
                break;
            case 'lastName':
                errors.user.lastName = value.length < 1 ? 'Enter Last Name' : '';
                break;
            case 'email':
                errors.user.email = this.isValidEmail(value) ? '' : 'Email is not valid!';
                break;
            case 'password':
                errors.user.password = value.length < 1 ? 'Enter Password' : '';
                break;
            case 'rePassword':
                errors.user.rePassword = this.isValidPassword(value) ? '' : 'This password must match the previous';
                break;
            default:
                break;
        }

        this.setState({ errors });
    }
    isValidEmail = (value) => {
        return !(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i.test(value))
    }
    isValidPassword = (value) => {
        if(this.state.user.password !== this.state.rePassword) {
            return false;
        }else{
            return  true
        }
    }

    submitForm = async (event) => {
        this.setState({submitted: true});
        const user = this.state.user;
        event.preventDefault();
        if (this.validateForm(this.state.errors)) {
            console.info('Valid Form')
            console.log(this.state.user)
            this.sendParams()
        } else {
            console.log('Invalid Form')
        }
    }

    validateForm = (errors) => {
        let valid = true;
        Object.entries(errors.user).forEach(item => {
            //console.log(item)
            item && item[1].length > 0 && (valid = false)
        })
        return valid;
    }

    async sendParams() {
        axios
            .post('http://localhost:8080/auth/save', {
                'id':'',
                'firstName' : this.state.user.firstName,
                'lastName' : this.state.user.lastName,
                'email' : this.state.user.email,
                'password' : this.state.user.password,
            })
            .then(res => {
                this.setState({ errorMessage:false });
                this.setState({ successfullyReg:true });
                this.setState( {disabled: !this.state.disabled} )
            }).catch(res => {
            this.setState({ errorMessage:true });
        })

        ;
    }

    render() {
        return (
            <div className="App">
                <div className="row">
                    <label className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-5 mb-2">
                        <input  disabled = {(this.state.disabled)? "disabled" : ""} type="text" value={this.state.user.firstName} name="firstName" onChange={(e) => {
                            this.handleInputChange(e)
                        }} className="form-control" placeholder="First Name"/>
                        {this.state.submitted && this.state.errors.user.firstName.length > 0 &&
                        <span className="text-danger">{this.state.errors.user.firstName}</span>}

                    </div>
                    <div className="col-sm-5 mb-2">
                        <input  disabled = {(this.state.disabled)? "disabled" : ""}  type="text" value={this.state.lastName} name="lastName" onChange={(e) => {this.handleInputChange(e) }} className="form-control" placeholder="Last Name"/>
                        {this.state.submitted && this.state.errors.user.lastName.length > 0 && <span className="text-danger">{this.state.errors.user.lastName}</span>}

                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>
                <div className="row"style={{marginTop: '1rem'}}>
                    <label  className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-6 mb-2">
                        <input  disabled = {(this.state.disabled)? "disabled" : ""}   type="email" value={this.state.user.email} name="email" onChange={(e) => {this.handleInputChange(e)}}className="form-control" id="email" placeholder="example@gmail.com" />
                        {this.state.submitted && this.state.errors.user.email.length > 0 && <span className="text-danger">{this.state.errors.user.email}</span>}

                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>
                <div className="row"style={{marginTop: '1rem'}}>
                    <label className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-6 mb-2">
                        <FormControl  disabled = {(this.state.disabled)? "disabled" : ""}  name="password" type="password" placeholder="Password"  value={this.state.user.password} onChange={(e) => {this.handleInputChange(e)}}/>
                        {this.state.submitted && this.state.errors.user.password.length > 0 &&  <span className="text-danger">{this.state.errors.user.password}</span>}

                    </div>
                    <div className="col-sm-4">
                    </div>
                </div>

                <div className="row" style={{marginTop: '1rem'}}>
                    <label  className="col-sm-2 col-form-label">Repeat password</label>
                    <div className="col-sm-6 mb-2">
                        <FormControl  disabled = {(this.state.disabled)? "disabled" : ""}  name="rePassword" type="password" placeholder="Repeat new Password" value={this.state.rePassword} onChange={(e) => {this.handlePassChange(e)}}/>
                        {this.state.submitted && this.state.errors.user.rePassword.length > 0 &&  <span className="text-danger">{this.state.errors.user.rePassword}</span>}

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