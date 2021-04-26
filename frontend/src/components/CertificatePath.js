import * as React from "react";
import axios from "axios";
import { connect } from 'react-redux';


class CertificatePath extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            certificates : [],
            marginLeft : 30
        }
    }

    componentDidMount() {
        axios.
            get("http://localhost:8080/api/certificate/getChain/" + this.props.certificate.alias,
            {  headers: {
                    'Content-Type': 'application/json',
                    Authorization : 'Bearer ' + this.props.jwt
                }
            })
            .then(res => {
                this.setState({
                    certificates : res.data
                })
            })
            .catch(res => alert("Something gone wrong!"))
    }

    render() {
        const Checks = this.state.certificates.reverse().map((value, key ) =>
            <div style={{marginLeft : this.state.marginLeft*key}}>
                <p> {value.subjectData.name} </p>
            </div>
        );
        return(
          <div>
              {Checks}
          </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        jwt: state.jwt,
    };
};

export default connect(mapStateToProps)(CertificatePath);