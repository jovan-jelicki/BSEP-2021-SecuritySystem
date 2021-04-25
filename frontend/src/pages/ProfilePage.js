import React from 'react';
import {Button, Container, Modal, Nav, Navbar} from "react-bootstrap";
import axios from "axios";

export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal : false,
            oldPw : "",
            newPw : "",
            repeatPw : "",
            repErr : "",
            wrongPw : "",
            user : !!localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
        }
    }
    componentDidMount() {
        if(this.state.user.role === null || this.state.user.role === undefined ) {
            window.location.replace("http://localhost:3000/unauthorized");
        }

        axios
            .get('http://localhost:8080/api/users/isAccountApproved/' + this.state.user.id,
                {  headers: {
                        "Access-Control-Allow-Origin": "*",
                        'Content-Type': 'application/json',
                        Authorization : 'Bearer ' + this.state.user.jwtToken
                    }
                })
            .then(res => {
                if(!res.data){
                    this.setState({
                        showModal : true
                    })
                }
            })
            .catch(res => alert("Greska!"));

    }
    sendData = () => {
        if(this.state.repeatPw !== this.state.newPw)
            return;

        axios
            .post('http://localhost:8080/api/users/approveAccount', {
                'userId' : this.state.user.id,
                'oldPassword' : this.state.oldPw,
                'newPassword' : this.state.newPw,
                'repeatedPassword' : this.state.repeatPw
            }, {  headers: {
                    'Content-Type': 'application/json',
                    Authorization : 'Bearer ' + this.state.user.jwtToken
                }
            })
            .then(res => {
                if(!res.data){
                    this.setState({
                        showModal : false
                    })
                }
            })
            .catch(res => this.setState({wrongPw : "First password is not correct!"}));
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name]: target.value
        })
        this.validatePassword(event);
    }

    validatePassword(event) {
        let repErr = ''
        let val = event.target.value;
        let newPass = this.state.newPw;

        if (event.target.name === 'repeatPw')
            if(val===''){
                repErr = 'Enter new password!';
            }
            if(val !== newPass.substr(0, Math.min(val.length, newPass.length)) ||
                (val.trim() === '' && newPass.trim() !== '')) {
                repErr = 'This password must match the previous';
            }

        this.setState({
            'repErr': repErr
        })
    }

    
    render() {
        return (
            <Container fluid style={{'background-color' : '#AEB6BF'}}>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="/profile">PKI</Navbar.Brand>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#certificates">Certificates</Nav.Link>
                            { this.state.user.role === "ROLE_admin" &&   <Nav.Link href="#createCertifiacate">Create certificate</Nav.Link> }
                        </Nav>
                        <Nav>
                            <Button onClick={this.logOut} style={{backgroundColor : "gray", borderColor : "gray"}}>LogOut</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                {this.props.children}
                {this.showModalDialog()}
            </Container>
    )
    }

    showModalDialog = () => {
        return (
            <Modal backdrop="static" show={this.state.showModal} onHide={this.handleModal}>
                <Modal.Header>
                    <Modal.Title>Verify account!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> You have to change password when you log in for first time.</p> <br/>
                    <p> First password : </p> <input name="oldPw" onChange={this.handleInputChange} value={this.state.oldPw} type={"password"}/>
                    <p> New password : </p> <input name="newPw" onChange={this.handleInputChange} value={this.state.newPw} type={"password"}/>
                    <p> Repeat new password : </p> <input name="repeatPw" onChange={this.handleInputChange} value={this.state.repeatPw} type={"password"}/>
                    <p style={{"color" : "red"}}>{this.state.repErr} </p>

                </Modal.Body>
                <Modal.Footer>
                    <p style={{"color" : "red"}}>{this.state.wrongPw}</p>
                    <Button variant="secondary" onClick={this.sendData}>
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    logOut = () => {
        localStorage.removeItem("user");
        this.props.history.push({
            pathname: "/"
        });
    }
}