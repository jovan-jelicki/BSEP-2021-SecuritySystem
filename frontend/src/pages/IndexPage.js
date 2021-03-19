import * as React from "react";
import ProfilePage from "./ProfilePage";
import LogInPage from "./LogInPage";
import RegistrationPage from "./RegistrationPage";
import CertificateListing from "../components/CertificateListing";

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="App">
                <ProfilePage history={this.props.history}>
                    <CertificateListing></CertificateListing>
                    <br/>
                    <br/>
                    <br/>
                    <RegistrationPage></RegistrationPage>
                </ProfilePage>
            </div>
        );
    }
}