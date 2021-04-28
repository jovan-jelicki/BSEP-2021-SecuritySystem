import * as React from "react";
import ProfilePage from "./ProfilePage";
import CertificateListing from "../components/CertificateListing";
import NewCertificate from "../components/NewCertificate";

import { connect } from 'react-redux'; 

class IndexPage extends React.Component {
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
                    {this.props.user.role === "ROLE_admin" && <NewCertificate></NewCertificate>}
                </ProfilePage>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(IndexPage);