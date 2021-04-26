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
            submitted:false,
            errors:{
                errorFirst : "",
                errorNew : "",
                errorRepeat:"",
            },
            blacklistedPasswords:[],
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

        this.fetchBlackListPasswords();
    }
    async fetchBlackListPasswords() {
        let response = await axios.get('http://localhost:8080/security/passwords');
        if(response && response.status && response.status == 200)
            this.setState({blacklistedPasswords: [...response.data]});
        else
            console.log("No blacklisted passwords.")
    }

    sendData = () => {

        this.setState({submitted:true});
        if( this.state.errors.errorFirst!=='' && this.state.errors.errorNew!=='' && this.state.errors.errorRepeat !==''){
                return;
        }

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
            .catch(res => this.setState({wrongPw : "Something went wrong.Please try again!"}));
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name]: target.value
        })
        this.validatePassword(event);
    }

    handlePassChange = (event) => {
        this.setState(
            (state,props) => ({ repeatPw : event.target.value}),
            () => this.validatePassword(event)
        )
    }

    validatePassword(event) {
        const {name, value} = event.target;
        let errors = this.state.errors;
        switch (name) {
            case 'oldPw':
                this.state.errors.errorFirst = this.checkPassword(this.state.password) ? 'Password must contains at least 8 characters (lowercase letter, capital letter, number and special character) or not be a common password!' : '';
                break;
            case 'newPw':
                this.state.errors.errorNew = value.length < 1 ? 'Enter new password' : '';
                break;
            case 'repeatPw':
                this.state.errors.errorRepeat = this.isValidRepeatedPassword(this.state.repeatPw) ? '' : 'This password must match the previous!';
                break;
            default:
                break;
        }
        this.setState({errors})
    }

    checkPassword =  (password) =>{
        console.log("Checking")
        if(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)){
            this.setState({
                passwordStrength: this.state.newPw
            })
            return true;
        }else if(this.state.blacklistedPasswords.includes(password)){
            this.setState({
                passwordStrength: this.state.newPw
            })
            return true;
        } else {
            this.setState({
                passwordStrength : ""
            })
            return false;
        }
    }


    isValidRepeatedPassword = (value) => {
        if(this.state.newPw !== this.state.repeatPw) {
            return false;
        }else{
            return  true
        }
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
                <Modal.Header  style={{'background':'gray'}}>
                    <Modal.Title>Verify account!</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{'background':'gray'}}>
                    <p> You have to change password when you log in for first time.</p> <br/>
                    <p> First password : </p> <input name="oldPw" onChange={e=>this.handleInputChange(e)} value={this.state.oldPw} type={"password"}/>
                    {this.state.submitted  && <span className="text-danger">{this.state.errors.errorFirst}</span>}
                    <p> New password : </p> <input name="newPw" onChange={e=>this.handleInputChange(e)} value={this.state.newPw} type={"password"}/>
                    {this.state.submitted  && <span className="text-danger">{this.state.errors.errorNew}</span>}
                    <p> Repeat new password : </p> <input name="repeatPw" onChange={(e) => {this.handlePassChange(e)}} value={this.state.repeatPw} type={"password"}/>
                    {this.state.submitted  && <span className="text-danger">{this.state.errors.errorRepeat}</span>}
                </Modal.Body>
                <Modal.Footer style={{'background':'gray'}}>
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