import * as React from "react";
import {Button, Form} from "react-bootstrap";
import axios from "axios";
import PasswordChange from "./PasswordChange";

export default class ResetPasswordCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resetCode:'',
        }
    }

    async componentDidMount() {
        let headers = new Headers();

        headers.append('Access-Control-Allow-Origin', '*');

        await axios
            .get('http://localhost:8080/api/users/getUserByEmail/'+this.props.email,{
                headers: {"Access-Control-Allow-Origin": "*"}

            })
            .then(res => {
                this.setState({
                    user:res.data
                })
                console.log(res.data);

            }).catch(res=> {
            this.setState({
                errors:{
                    email: "Please enter valid email!"
                },
            })
        })
    }

    handleInputChange = (event) => {
        const target = event.target;
        this.setState({
            [target.name] : target.value,
        })
    }

    submitResetCode=()=>{
        if(this.isValidResetCode(this.state.resetCode)) {
            this.props.onChangeValue();
        }
    }
    isValidResetCode=(value)=>{
        console.log(this.state.user.resetCode);
        console.log(value);
        if(value==this.state.user.resetCode){
            this.setState({
                errors:{
                    resetCode: ""
                }
            })
            return true;
        }else{
            this.setState({
                errors:{
                    resetCode: "Please enter valid reset code!"
                }
            })
            return false;
        }
    }
    render() {
        return (
            <div>
                {!this.state.nextStep &&
                <tr>
                    <td colSpan="2">
                        <p style={{textAlign: 'center', margin: 20}}>Please enter the code you were sent by email. It
                            wil look something like MFcRhYpDo1.<br/> You may need a few moments before it arrives </p>
                    </td>
                </tr>
                }
                  {!this.state.nextStep &&
                <tr>
                    <td> Enter your reset code:</td>
                    <td>
                        <Form.Control autoFocus type="text" name="resetCode" onChange={e => this.handleInputChange(e)} value={this.state.resetCode}/>
                    </td>
                    <td colSpan="2">
                        <Button variant="info" style={{display:'block', margin:'auto'}}  onClick={e => this.submitResetCode(e)}> Confirm </Button>
                    </td>
                </tr>
                }

            </div>
        )
    }
}