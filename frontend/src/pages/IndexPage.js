import * as React from "react";
import ProfilePage from "./ProfilePage";
import LogInPage from "./LogInPage";
import RegistrationPage from "./RegistrationPage";
import CertificateListing from "../components/CertificateListing";
import NewCertificate from "../components/NewCertificate";

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : !!localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
        }
    }

    render() {
        return (
            <div className="App">
                <ProfilePage history={this.props.history}>
                    <CertificateListing></CertificateListing>
                    <br/>
                    <br/>
                    <br/>
                    {this.state.user.role === "ROLE_admin" && <NewCertificate></NewCertificate>}
                </ProfilePage>
            </div>
        );
    }
}