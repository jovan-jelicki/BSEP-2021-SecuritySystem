import * as React from "react";
import {Alert, Button, Container, Form, Table} from "react-bootstrap";
import axios from "axios";

export default class ForgottenPass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            step2: false,
            resetCode:'',
            user:null
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        console.log(target.name)
        this.setState({
            [target.name] : target.value,
        })
        console.log(target.value)

    }

    handleSubmit = () => {
        //alert(this.state.email)
        this.setState({
                   step2:true
        })

        axios
            .put("http://localhost:8080/api/email/send", {
                'to' :this.state.email,
                'subject': "Recover your password",
            })
            .then(res => {
               this.getUserByEmail();

            }).catch(res=> {
            alert("NECE DA MOZE")
        })
    }

    getUserByEmail=()=>{
        let headers = new Headers();

        headers.append('Access-Control-Allow-Origin', '*');

        axios
            .get('http://localhost:8080/api/users/getUserByEmail/'+this.state.email,{
                headers: {"Access-Control-Allow-Origin": "*"}

            })
            .then(res => {
                this.setState({
                    user:res.data
                })
                console.log(this.state.user);

            }).catch(res=> {
            alert("NECE DA MOZE")
        })
    }

    handleResetCode=()=>{
        if(this.state.resetCode!=this.user.resetCode){
            alert("razliciti");
        }else{
            alert("ok")
        }
    }


    render() {
        return (
            <div style={{'background-color' : '#AEB6BF'}}>
                <div style={{ overflowY: "auto", height: "500px", width:"1000px", marginLeft:'auto', marginRight:'auto'}}>
                <Table striped bordered hover variant="dark" >
                    <tbody>
                    <tr >
                        <td colSpan="2">
                        <p style={{textAlign:'center', margin:20}}> Follow these instructions if you forgot your password and need to create a new one. </p>
                        </td>
                    </tr>
                    {!this.state.step2 &&
                    <tr>
                        <td> Please enter your email address:</td>
                        <td>
                            <Form.Control autoFocus type="email" name="email" value={this.state.email}
                                          onChange={e => this.handleInputChange(e)}/>
                        </td>
                    </tr>
                    }
                    {!this.state.step2 &&
                        <tr>
                        <td></td>
                        <td colSpan="2">
                        <Button variant="info" style={{display:'block', margin:'auto'}}  onClick={this.handleSubmit}> Confirm </Button>
                        </td>
                        </tr>
                    }
                    {this.state.step2 &&
                    <tr>
                        <td colSpan="2">
                            <p style={{textAlign:'center', margin:20}}> Please check your email for a text message with your reset code </p>
                        </td>
                    </tr>
                    }
                    {this.state.step2 &&
                    <tr>
                        <td> Enter your reset code:</td>
                        <td>
                            <Form.Control autoFocus type="text" name="resetCode" onChange={e => this.handleInputChange(e)} value={this.state.resetCode}/>
                        </td>
                        <td colSpan="2">
                            <Button variant="info" style={{display:'block', margin:'auto'}}  onClick={this.handleResetCode}> Confirm </Button>
                        </td>
                    </tr>
                    }
                    </tbody>

                </Table>
            </div>
            </div>
            );
    }
}