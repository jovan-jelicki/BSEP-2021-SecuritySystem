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
            errors: {
                'password': 'Enter password',
                'rePassword': 'Repeat password'
            },
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

    handlePasswordChange = (event) => {
        this.setState(
            (state, props) => ({rePassword: event.target.value}),
            () => this.validationErrorMessage(event)
        )
    }
    validationErrorMessage = (event) => {
        const {name, value} = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'password':
                errors.password = this.checkPassword(value) ? 'Password must contains at least 8 characters (lowercase letter, capital letter, number and special character) or not be a common password!' : '';
                break;
            case 'rePassword':
                errors.rePassword = this.isValidRepeatedPassword(value) ? '' : 'This password must match the previous!';
                break;
            default:
                break;
        }
        this.setState({errors})

    }
    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name]: target.value,
        })
        this.validationErrorMessage(event);
    }

    isValidRepeatedPassword = (value) => {
        if (this.state.password !== this.state.rePassword) {
            return false;
        } else {
            return true
        }
    }


    checkPassword = (password) => {
        console.log("Checking")
        if (/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)) {
            this.setState({
                passwordStrength: this.state.password
            })
            return true;
        } else if (this.state.blacklistedPasswords.includes(password)) {
            this.setState({
                passwordStrength: this.state.password
            })
            return true;
        } else {
            this.setState({
                passwordStrength: ""
            })
            return false;
        }
    }


    submitPassword = async (event) => {
        this.setState({submitted: true});
        event.preventDefault();

        if (this.state.errors.password == "" && this.state.errors.rePassword == "") {
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
                alert("bravo");
                this.props.onChangeValue();
                this.setState({
                    success: true,
                })

            }).catch(res => {
            alert("plakili")

        })

    }

    render() {
        return (
            <div>
                <tr>
                    <td colSpan="2">
                        <p style={{textAlign: 'center', margin: 20}}> Change your password.<br/>Password must contains at least 8 characters (lowercase letter, capital letter, number and special character) or not be a common password! </p>
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
                                <span className="text-danger">{this.state.errors.password}</span>}

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
                                <span className="text-danger">{this.state.errors.rePassword}</span>}
                                <PasswordStrengthBar password={this.state.passwordStrength}/>

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