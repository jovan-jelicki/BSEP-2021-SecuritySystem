import * as React from "react";
import {Button, Form, Table} from "react-bootstrap";
import PasswordStrengthBar from "react-password-strength-bar";
import axios from "axios";

export default class PasswordChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password:'',
            rePassword:'',
            passwordStrength : "",
            errors: {
                'password': 'Enter password',
                'rePassword' : 'Repeat password'
            },
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

    handlePasswordChange = (event) => {
        this.setState(
            (state,props) => ({ rePassword : event.target.value}),
            () => this.validationErrorMessage(event)
        )
    }
    validationErrorMessage = (event) => {
        const {name, value} = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'password':
                this.setState({
                    passwordErr: this.checkPassword(this.state.password) ? 'Password must contains at least 8 characters (lowercase letter, capital letter, number and special character) or not be a common password!' : '',
                    //validForm: false,
                })
                break;
            case 'rePassword':
                this.setState({
                    rePasswordErr: this.isValidRepeatedPassword(this.state.rePassword) ? '' : 'This password must match the previous!',
                    //validForm: false,
                })
                break;
            default:
                break;
        }

    }
    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name] : target.value,
        })
        this.validationErrorMessage(event);
    }

    isValidRepeatedPassword = (value) => {
        if(this.state.password !== this.state.rePassword) {
            return false;
        }else{
            return  true
        }
    }


    checkPassword =  (password) =>{
        console.log("Checking")
        if(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)){
            this.setState({
                passwordStrength: this.state.password
            })
            return true;
        }else if(this.state.blacklistedPasswords.includes(password)){
            this.setState({
                passwordStrength: this.state.password
            })
            return true;
        } else {
            this.setState({
                passwordStrength : ""
            })
            return false;
        }
    }
    validateForm = (errors) => {
        let valid = true;
        Object.entries(errors).forEach(item => {
            console.log(item)
            item && item[1].length > 0 && (valid = false)
        })
        return valid;
    }

    submitPassword = async (event) => {
        this.setState({ submitted: true });
        event.preventDefault();
        const errors = [ 'password', 'rePassword'];
        if (this.validateForm(errors)) {
            await this.sendParams()
            this.setState({submitted: true});
        } else {
            console.log('Invalid Form')
        }
    }
    async sendParams() {
        axios
            .post('http://localhost:8080/auth/changePassword', {
                'email' : this.state.email,
                'password' : this.state.password,
            })
            .then(res => {
                alert("USPEOOOOOO")

            }).catch(res => {
            alert("plakili")

        })

    }


    render() {
        return (
            <div>
                <tr>
                    <td style={{ overflowY: "auto", width: "500px", textAlign:'center'}}> Enter your password:</td>
                    <td >
                        <Form.Control style={{  width: "400px"}}
                                      autoFocus type="password" name="password" onChange={e => this.handleInputChange(e)} value={this.state.password}/>
                        {this.state.submitted  &&  <span className="text-danger">{this.state.errors.password}</span>}

                    </td>

                </tr>

                <tr>
                    <td style={{ overflowY: "auto", width: "500px", textAlign:'center'}}> Re-type password:</td>
                    <td>
                        <Form.Control style={{ width: "400px"}}
                                      autoFocus type="password" name="rePassword"  value={this.state.rePassword} onChange={(e) => {this.handlePasswordChange(e)}} />
                        {this.state.submitted &&  <span className="text-danger">{this.state.errors.rePassword}</span>}
                        <PasswordStrengthBar password={this.state.passwordStrength} />

                    </td>

                </tr>
                <tr>
                    <td colSpan="2">
                        <Button variant="info" style={{display:'block', margin:'auto'}}  onClick={this.submitPassword}> Submit </Button>
                    </td>
                </tr>
            </div>
        )
    }
}