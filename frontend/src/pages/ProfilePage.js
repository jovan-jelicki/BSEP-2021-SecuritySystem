import React from 'react';
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import { withRouter} from 'react-router-dom';



export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : !!localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
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
            </Container>
        )
    }

    logOut = () => {
        localStorage.removeItem("user");
        this.props.history.push({
            pathname: "/"
        });
    }
}