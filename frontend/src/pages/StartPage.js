import * as React from "react";
import { Button, Form, } from "react-bootstrap";

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
                            value={this.state.email}
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                        />
                    </Form.Group>
                    <Button block size="lg" disabled={!this.validateForm}>
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

    handleInputChange = () => {

    }

    handleSubmit = () => {

    }

}