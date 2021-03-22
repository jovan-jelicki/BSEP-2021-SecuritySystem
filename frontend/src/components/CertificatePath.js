import * as React from "react";

export default class CertificatePath extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            check : ["prvi", "drugi", "treci"],
            marginLeft : 30
        }
    }

    render() {
        const Checks = this.state.check.map((value, key ) =>
            <div style={{marginLeft : this.state.marginLeft*key}}>
                <p> {value} </p>
            </div>
        );
        return(
          <div>
              {Checks}
          </div>
        );
    }
}