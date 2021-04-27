import * as React from "react";
import {Button, Form, Table} from "react-bootstrap";
import PasswordStrengthBar from "react-password-strength-bar";
import axios from "axios";

export default class PasswordChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            rePassword: '',
            passwordStrength: "",
            'errPassword': 'Enter password',
            'errRePassword': 'Repeat password',
            blacklistedPasswords: [],
            success: false
        }
    }

    async componentDidMount() {
        let response = await axios.get('http://localhost:8080/security/passwords');
        if (response && response.status && response.status == 200)
            this.setState({blacklistedPasswords: [...response.data]});
        else
            console.log("No blacklisted passwords.")
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState(
            (state,props) => ({ [target.name]  : target.value}),
            () => this.validationErrorMessage(event)
        )
    }

    handlePasswordChange = (event) => {
        this.setState(
            (state, props) => ({rePassword: event.target.value}),
            () => this.validationErrorMessage(event)
        )
    }
    validationErrorMessage = (event) => {
        const {name, value} = event.target;
        switch (name) {
            case 'password':
                this.setState({
                    errPassword : this.checkPassword(this.state.password) ? 'Password must contains at least 8 characters (lowercase letter, capital letter, number and special character) or not be a common password!' : '',
                    //validForm: false,
                })
                break;
            case 'rePassword':
                this.setState({
                    errRePassword : this.isValidRepeatedPassword(this.state.rePassword) ? '' : 'This password must match the previous!',
                })
                break;
            default:
                break;
        }
    }


    isValidRepeatedPassword = (value) => {
        if (this.state.password !== this.state.rePassword) {
            return false;
        } else {
            return true
        }
    }


    checkPassword =  (password) =>{
        console.log("Checking")
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

    validateForm = (errors) => {
        let valid = true;
        for (const Error of errors) {
            this.validationErrorMessage(this.createTarget(Error));
        }
        //Promeniti!
        if (this.state.errPassword !== "" || this.state.errRePassword !== "") {
            return !valid;
        }
        return valid;
    }
    createTarget = (error) => {
        return {target : {value : error, name : error}}
    }

    submitPassword = async (event) => {
        this.setState({submitted: true});
        event.preventDefault();
        const errors = ['password','rePassword'];

        if (this.validateForm(errors)) {
            await this.sendParams()
        } else {
            console.log('Invalid Form')
        }
    }

    async sendParams() {
        axios
            .post('http://localhost:8080/auth/changePassword', {
                'email': this.props.email,
                'password': this.state.password,
            })
            .then(res => {
                this.props.onChangeValue();
                this.setState({
                    success: true,
                })

            }).catch(res => {
            alert("Something went wrong!")

        })

    }

    render() {
        return (
            <div>
                <tr>
                    <td colSpan="2">
                        {!this.state.success ?
                            <p style={{textAlign: 'center', margin: 20}}> Change your password.<br/>Password must
                                contains at least 8 characters (lowercase letter, capital letter, number and special
                                character) or not be a common password! </p>
                            :
                            <p style={{textAlign: 'center', margin: 20}}> Successfully </p>
                        }
                            </td>
                </tr>
                {this.state.success ?
                    <tr>
                        <td>
                            <p style={{textAlign: 'center', margin: 20}}>Password Updated!<br/>
                                Your password has been changed successfully. <br/>
                                Use your new password to log in.</p>
                        </td>
                        <td>
                            <Button style={{width: "350px", display: 'block', margin: 'auto'}} variant="outline-warning"
                                    href={'/'}>LOG IN</Button>

                        </td>
                    </tr>
                    :
                    <div>
                        <tr>
                            <td style={{overflowY: "auto", width: "500px", textAlign: 'center'}}> Enter your password:
                            </td>
                            <td>
                                <Form.Control style={{width: "400px"}}
                                              autoFocus type="password" name="password"
                                              onChange={e => this.handleInputChange(e)} value={this.state.password}/>
                                {this.state.submitted &&
                                <span className="text-danger">{this.state.errPassword}</span>}
                                <PasswordStrengthBar password={this.state.passwordStrength}/>

                            </td>

                        </tr>

                        <tr>
                            <td style={{overflowY: "auto", width: "500px", textAlign: 'center'}}> Re-type password:</td>
                            <td>
                                <Form.Control style={{width: "400px"}}
                                              type="password" name="rePassword" placeholder="Repeat new Password"
                                              value={this.state.rePassword} onChange={(e) => {
                                    this.handlePasswordChange(e)
                                }}/>
                                {this.state.submitted &&
                                <span className="text-danger">{this.state.errRePassword}</span>}

                            </td>

                        </tr>
                        <tr>
                            <td colSpan="2">
                                <Button variant="info" style={{display: 'block', margin: 'auto'}}
                                        onClick={this.submitPassword}> Submit </Button>
                            </td>

                        </tr>
                    </div>

                }

            </div>
        )
    }
}