import * as React from "react";
import {Alert, Button, Container, Form, Table} from "react-bootstrap";
import axios from "axios";
import ResetPasswordCode from "../components/ResetPasswordCode";
import PasswordChange from "../components/PasswordChange";

export default class ForgottenPass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            step1:true,
            step2: false,
            step3: false,
            step4:false,
            user:null,
            submitted:false,
            success:false,
            emailError: 'Enter email',

        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name] : target.value,
        })

        this.validateEmail(target.value);
    }

    validateEmail=(value)=>{
        if(this.isValidEmail(value) ) {
            this.setState({
                emailError:''
            })
        }else{
            this.setState({
                emailError:'Email is not valid!',
            })
        }
    }

    isValidEmail = (value) => {
        return !(value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i.test(value))
    }


    handleSubmit = () => {
        let error = this.state.emailError;
        this.setState({ submitted: true });
        if(this.state.emailError=="") {
            this.sendMail();
        }else{
            error="Please enter valid email address!"
        }

        this.setState({ error });
    }



    async sendMail(){
          await axios
            .put("http://localhost:8080/api/email/send", {
                'to': this.state.email,
                'subject': "Recover your password",
            })
            .then(res => {
                this.setState({
                    step2:true,
                    step1:false
                })
            }).catch(res => {
                alert("NECE DA MOZE")
            })
    }

    nextStep=()=>{
        this.setState({
            step1:false,
            step2:false,
            step3:true,
        })
    }

    setStateFromChild=()=>{
        this.setState({
            step4:true,
            step3:false
        })
    }

    setSuccessFromChild=()=>{
        this.setState({
            success:true
        })
    }


    render() {
        return (
            <div style={{'background-color' : '#AEB6BF'}}>
                <div style={{ overflowY: "auto", height: "500px", width:"1000px", marginLeft:'auto', marginRight:'auto'}}>
                    <Table striped bordered hover variant="dark" >
                        <tbody>
                        {!this.state.step4 &&
                        <tr>
                            <td colSpan="2">
                                <p style={{textAlign: 'center', margin: 20}}> Follow these instructions if you forgot
                                    your password and need to create a new one. </p>
                            </td>
                        </tr>
                        }

                        {this.state.step1 &&
                        <tr>
                            <td> Please enter your email address:</td>
                            <td>
                                <Form.Control autoFocus type="email" name="email" value={this.state.email} onChange={e => this.handleInputChange(e)}/>

                            </td>
                        </tr>

                        }
                        {this.state.step1 &&
                            <tr>
                                <td></td>
                                <td>
                                {this.state.submitted && this.state.emailError.length > 0 && <span className="text-danger">{this.state.emailError}</span>}
                                </td>
                            </tr>
                        }
                        {this.state.step1 &&
                        <tr>
                            <td></td>
                            <td colSpan="2">
                                <Button variant="info" style={{display:'block', margin:'auto'}}  onClick={this.handleSubmit}> Confirm </Button>
                            </td>
                        </tr>
                        }
                        {this.state.step2 &&
                        <tr>
                            <p>Your old password has been locked for security reasons.To unlock your profile you must verify your identity.</p>
                            <p>Please check your email for a text message with your reset code</p>
                            <td colSpan="2">
                            <Button variant="outline-primary" onClick={this.nextStep} >Next step</Button>
                            </td>
                        </tr>
                        }

                        {this.state.step3 && <ResetPasswordCode email={this.state.email}  onChangeValue={this.setStateFromChild}/>}
                        {this.state.step4 && <PasswordChange email={this.state.email} onChangeValue={this.setSuccessFromChild}/>}

                        </tbody>

                    </Table>
                </div>
            </div>
        );
    }
}