import * as React from "react";
import {Alert, Button, Container, Form, Table} from "react-bootstrap";
import axios from "axios";

export default class ForgottenPass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            user : !!localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name] : target.value,
        })
    }

    handleSubmit = () => {
        //alert(this.state.email)
        axios
            .put("http://localhost:8080/api/email/send", {
                'to' :"t.kovacevic98@gmail.com",
                'subject': "Recover your password",
                'body':"BLA"
            })
            .then(res => {
                alert("POSLAO")
            }).catch(res=> {
            alert("NECE DA MOZE")
        })
    }

    render() {
        return (
            <div style={{'background-color' : '#AEB6BF'}}>
                <div style={{ overflowY: "auto", height: "250px", width:"1000px", marginLeft:'auto', marginRight:'auto'}}>
                <Table striped bordered hover variant="dark" >
                    <tbody>
                    <tr >
                        <td colSpan="2">
                        <p style={{textAlign:'center', margin:20}}> Follow these instructions if you forgot your password and need to create a new one. </p>
                        </td>
                        </tr>
                    <tr>
                        <td> Please enter your email address: </td>
                        <td>
                            <Form.Control autoFocus type="email"  name="email" value={this.state.email} onChange={e => this.handleInputChange(e)}/>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td colSpan="2">
                            <Button variant="info" style={{display:'block', margin:'auto'}}  onClick={this.handleSubmit}> Confirm </Button>

                        </td>
                    </tr>
                    </tbody>

                </Table>
            </div>
            </div>
            );
    }
}