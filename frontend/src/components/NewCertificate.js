import * as React from "react";
import NewRootCertificate from "./NewRootCertificate";
import NewInterCertificate from "./NewInterCertificate";
import NewEndCertificate from "./NewEndCertificate";

export default class NewCertificate extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            navbar : "root",
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
                    <h2 id={"createCertificate"} style={{textDecorationLine:'underline'}}> Create certificate</h2>
                    <ul className="nav justify-content-center">
                        <li className="nav-item">
                            <a className="nav-link active" style={{color:'#1a237e'}} onClick={this.handleChange} name="root">New Root Certificate</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" style={{color:'#1a237e'}} name="inter" onClick={this.handleChange}>New Intermediate Certificate</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" style={{color:'#1a237e'}} name="end" onClick={this.handleChange}>New End Entity Certificate</a>
                        </li>
                    </ul>
                    {this.renderNavbar()}
                </div>
            </div>
        );
    }
}