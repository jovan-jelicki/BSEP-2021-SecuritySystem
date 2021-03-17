import React from 'react';
import {Button, Container, Nav, Navbar} from "react-bootstrap";


export default class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container fluid style={{'background-color' : '#AEB6BF'}}>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="/">PKI</Navbar.Brand>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#pharmacies">Certificates</Nav.Link>
                            <Nav.Link href="#medications">Create certificate</Nav.Link>
                        </Nav>
                        <Nav>
                            <Button style={{backgroundColor : "gray", borderColor : "gray"}}>LogOut</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        )
    }
}