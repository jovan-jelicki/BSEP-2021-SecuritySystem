import * as React from "react";
import { Button, Form, Modal, } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import RegistrationPage from "./RegistrationPage";
import { connect } from 'react-redux';
import * as actionTypes from './../store/actions';

const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

class LogInPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            email: '',
            showModal: false,
            badCredentials: true,
            reCaptcha: 0,
            logInDisabled: false
        }
    }

    componentDidMount(){
        localStorage.clear();
    }

    render() {
        return (
            <div style={{ padding: '60px 0', margin: '0 auto', maxWidth: '320px' }}>
                <br />
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
                    <p hidden={this.state.badCredentials} style={{ color: "red" }}> Invalid username or password!</p>
                    <div style={{ display: "flex" }}>
                        <a href={'/#'} style={{ float: "right" }}> Forgot password?</a>
                    </div>
                    <br />
                    {this.state.reCaptcha >= 3 &&
                        <ReCAPTCHA
                            style={{ display: "inline-block" }}
                            theme="light"
                            ref={React.createRef()}
                            sitekey={TEST_SITE_KEY}
                            onChange={this.closeCaptcha}
                            asyncScriptOnLoad={this.asyncScriptOnLoad}
                        />
                    }
                    <Button block size="lg" disabled={this.state.logInDisabled} onClick={this.handleSubmit}>
                        Login
                    </Button>
                </Form>
                <br />
                <div style={{ display: " table" }}>
                    <p style={{ display: "table-cell" }}>Don't have account?</p>
                    <a style={{ display: "table-cell" }} className="nav-link" style={{ 'color': '#00d8fe', 'fontWeight': 'bold' }} href='#' name="workHours" onClick={this.handleModal}>Register</a>
                </div>


                <Modal show={this.state.showModal} onHide={this.closeModal} style={{ 'height': 650 }} >
                    <Modal.Header closeButton style={{ 'background': 'silver' }}>
                        <Modal.Title>Registration</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ 'background': 'silver' }}>
                        <RegistrationPage />
                    </Modal.Body>
                </Modal>


            </div>
        )
    }

    closeCaptcha = () => {
        this.setState({
            reCaptcha: 0,
            logInDisabled: false
        })
    }

    validateForm = () => {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    closeModal = () => {
        this.setState({
            showModal: !this.state.showModal
        });
    }


    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name]: target.value,
        })
    }

    handleSubmit = () => {
        axios
            .post('http://localhost:8080/auth/login', {
                email: this.state.email,
                password: this.state.password
            })
            .then(res => {
                // localStorage.setItem("user", JSON.stringify(res.data));
                this.props.onUserSave({
                    id: res.data.id,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    role: res.data.role,
                });
                this.props.onJwtSave(res.data.jwtToken);
                
                this.props.history.push({
                    pathname: "/profile"
                });
            })
            .catch(res => {
                console.log(res);
                if (this.state.reCaptcha >= 2) {
                    this.setState({
                        reCaptcha: this.state.reCaptcha + 1,
                        logInDisabled: true,
                        badCredentials: false
                    })
                } else {
                    this.setState({
                        reCaptcha: this.state.reCaptcha + 1,
                        badCredentials: false
                    })
                }
            });
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onUserSave: (user) =>
            dispatch({ type: actionTypes.SAVE_USER, user: user }),
        onJwtSave: (jwt) =>
            dispatch({ type: actionTypes.SAVE_JWT, jwt: jwt }),
    };
};

export default connect(null, mapDispatchToProps)(LogInPage); // null ako se ne koristi mapStateToProps