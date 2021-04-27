import React from 'react';
import {Button, Container, Modal, Nav, Navbar} from "react-bootstrap";
import axios from "axios";
import { connect } from 'react-redux';
import * as actionTypes from './../store/actions';

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal : false,
            oldPw : "",
            newPw : "",
            repeatPw : "",
            submitted:false,
            errorFirst : "Please enter old password.",
            errorNew : "Please enter new password.",
            errorRepeat:"Please repeat new password",

            blacklistedPasswords:[],
        }
    }

    componentDidMount() {
        if(!this.props.user.role) window.location.replace("http://localhost:3000/unauthorized");

        axios
            .get('http://localhost:8080/api/users/isAccountApproved/' + this.props.user.id,
                {  headers: {
                        "Access-Control-Allow-Origin": "*",
                        'Content-Type': 'application/json',
                        Authorization : 'Bearer ' + this.props.jwt
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

    handleInputChange = (event) => {
        const target = event.target;
        this.setState(
            (state, props) => ({[target.name]: target.value}),
            () => this.validationErrorMessage(event)
        )
    }

    handlePassChange = (event) => {
        this.setState(
            (state,props) => ({ repeatPw : event.target.value}),
            () => this.validationErrorMessage(event)
        )
    }

    validationErrorMessage(event) {
        const {name, value} = event.target;

        switch (name) {
            case 'newPw':
                this.setState({
                    errorFirst: this.checkPassword(this.state.password) ? 'Password must contains at least 8 characters (lowercase letter, capital letter, number and special character) or not be a common password!' :'',
                })
                break;
            case 'oldPw':
                this.setState({
                    errorNew : value.length < 1 ? 'Enter old password' : '',
                })
                break;
            case 'repeatPw':
                this.setState({
                    errorRepeat : this.isValidRepeatedPassword(this.state.repeatPw) ? '' : 'This password must match the previous!',

                })
                break;
            default:
                break;
        }

    }


    submitForm=()=>{
        this.setState({submitted:true});
        if(this.state.errorFirst!=='' || this.state.errorNew!=='' || this.state.errorRepeat !==''){
            return;
        }else{
            this.sendData();
        }
    }



    sendData = () => {
        axios
            .post('http://localhost:8080/api/users/approveAccount', {
                'userId' : this.props.user.id,
                'oldPassword' : this.state.oldPw,
                'newPassword' : this.state.newPw,
                'repeatedPassword' : this.state.repeatPw
            }, {  headers: {
                    'Content-Type': 'application/json',
                    Authorization : 'Bearer ' + this.props.jwt
                }
            })
            .then(res => {
                if(!res.data){
                    this.setState({
                        showModal : false
                    })
                }
            })
            .catch(res => this.setState({
               errorFirst : "Your old password is wrong.Please try again!"
            }));
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
                            { this.props.user.role === "ROLE_admin" &&   <Nav.Link href="#createCertifiacate">Create certificate</Nav.Link> }
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
                    {this.state.submitted  && <span className="text-danger">{this.state.errorFirst}</span>}
                    <p> New password : </p> <input name="newPw" onChange={e=>this.handleInputChange(e)} value={this.state.newPw} type={"password"}/>
                    {this.state.submitted  && <span className="text-danger">{this.state.errorNew}</span>}
                    <p> Repeat new password : </p> <input name="repeatPw" onChange={(e) => {this.handlePassChange(e)}} value={this.state.repeatPw} type={"password"}/>
                    {this.state.submitted  && <span className="text-danger">{this.state.errorRepeat}</span>}
                </Modal.Body>
                <Modal.Footer style={{'background':'gray'}}>
                    <Button variant="secondary" onClick={this.submitForm}>
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    logOut = () => {
        this.props.onUserRemove();
        this.props.onJwtRemove();
        this.props.history.push({
            pathname: "/"
        });
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        jwt: state.jwt,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onUserRemove: () =>
            dispatch({ type: actionTypes.REMOVE_USER }),
        onJwtRemove: () =>
            dispatch({ type: actionTypes.REMOVE_JWT }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);