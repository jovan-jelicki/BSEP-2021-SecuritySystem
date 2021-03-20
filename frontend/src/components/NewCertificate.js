import * as React from "react";
import NewRootCertificate from "./NewRootCertificate";
import NewInterCertificate from "./NewInterCertificate";
import NewEndCertificate from "./NewEndCertificate";

export default class NewCertificate extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            navbar : "root",
            user : !!localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},

        }
    }
    renderNavbar = () => {
        if (this.state.navbar === "root")
            return (
               <NewRootCertificate/>
            );
        else if (this.state.navbar === "inter")
            return (
                <NewInterCertificate/>
            );
        else if (this.state.navbar === "end")
            return (
                <NewEndCertificate/>
            );
    }

    handleChange = (event) => {
        const target = event.target;
        const name = target.name;

        this.setState({
            navbar : name
        });
    }


    render() {
        return (
            <div className="App" >
                <div style={{textAlign:"center",display:"inline-block", width:650}}>
                    <h2 id={"createCertificate"}> Create certificate</h2>
                    <ul className="nav justify-content-center">
                        <li className="nav-item">
                            <a className="nav-link active"  onClick={this.handleChange} name="root">New Root Certificate</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link"  name="inter" onClick={this.handleChange}>New Intermediate Certificate</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link"  name="end" onClick={this.handleChange}>New End Entity Certificate</a>
                        </li>
                    </ul>
                    {this.renderNavbar()}
                    {/*<Navbar collapseOnSelect expand="lg" variant="dark" >
                        <Nav className="mr-auto">
                            <Nav.Link href="#rootCert" style={{color:"#333333"}}>New Root Certificate</Nav.Link>
                            <Nav.Link href="#interCert" style={{color:"#333333"}}>New Intermediate Certificate</Nav.Link>
                            <Nav.Link href="#endEntCert" style={{color:"#333333"}}>New End Entity Certificate</Nav.Link>
                        </Nav>
                    </Navbar>
*/}
                </div>
            </div>
        );
    }
}