import React from 'react';
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import { connect } from 'react-redux'; 
import * as actionTypes from './../store/actions';

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        if(!this.props.user.role) window.location.replace("http://localhost:3000/unauthorized");
        return;
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
            </Container>
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