import * as React from "react";
import { Button, Form, } from "react-bootstrap";
import axios from "axios";

export default class StartPage extends React.Component {
    constructor() {
        super();
        this.state = {
            password : '',
            email : '',
            user : !!localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
        }
    }

    render() {
        return (
            <div style={{padding : '60px 0', margin : '0 auto', maxWidth : '320px'}}>
                <br/>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            autoFocus
                            type="email"
                            name="email"
                            value={this.state.email}
                            onChange={e => this.handleInputChange(e)}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={e => this.handleInputChange(e)}
                        />
                    </Form.Group>
                    <Button block size="lg" disabled={!this.validateForm} onClick={this.handleSubmit}>
                        Login
                    </Button>
                </Form>
                <br/>
                <br/>
                <div style={{display : " table"}}>
                    <p style={{display: "table-cell"}}>Don't have account?</p>
                    <a style={{display: "table-cell"}} className="nav-link" style={{'color' : '#00d8fe', 'fontWeight' : 'bold'}} href='#' name="workHours" onClick={this.registration}>Registrate</a>
                </div>
            </div>
        )
    }

    validateForm = () => {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    registration = () => {

    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name] : target.value,
        })
    }

    handleSubmit = () => {
        axios
            .post('http://localhost:8080/auth/login', {
                email : this.state.email,
                password: this.state.password
            })
            .then(res => {
                localStorage.setItem("user", JSON.stringify(res.data))
            })
            .catch(res => alert("Bad request!"));
    }

}