import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Form } from  'react-bootstrap'

import './signInPage.css'
import AuthService from '../../api/auth.service'
const Heading = styled.h1`
  margin-top: 0;
`;

const FormContainer = styled.div`
  max-width: 480px;
  width: 100%;
  background-color: #edf4ff;
  padding: 30px;
  border-radius: 5px;
`;



class SignInPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.authservice = new AuthService()
  }

    async handleSubmit(event) {
        event.preventDefault()
        const { email, password, } = this.state;

        try {
            const result  = await this.authservice.signin(email, password)
            console.log(result,'InSide sign in page')
            this.props.history.push('/stockin')
        } catch(error) {
            alert('Incorrect email or password.')
        }
    }

    goToSignUp = () => {
        this.props.history.push('/signup/')
    };

  render() {

    return (
     <div className="container">
        <div>
      <h5 className="m-3 d-flex justify-content-center">
        Welcome to Stock Management.
      </h5>
      </div>
      <div className="d-flex justify-content-center" style={{margin: "50px"}}>
        <FormContainer>
        <Heading>Hello!</Heading>
          <p>Fill in your email and password to sign in.</p>
          <Form onSubmit={this.handleSubmit}>

          <Form.Group controlId="Email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                  type="email"
                  name="email"
                  required
                  placeholder="example@gmail.com"
                  autoComplete="off"
                  onChange={e => this.setState({ email: e.target.value })}
              />
          </Form.Group>
          <Form.Group controlId="Password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                  type="password"
                  name="Password"
                  required
                  placeholder="xxxxxxxxxx"
                  autoComplete="off"
                  onChange={e => this.setState({ password: e.target.value })}
              />
          </Form.Group>

          <Form.Group>
              <Button variant="primary" type="submit">SIGN IN</Button>
          </Form.Group>
          {/* <Button fullWidth onClick={this.goToSignUp}>
              Don't have an account? Sign up now!
            </Button> */}
      </Form>
        </FormContainer>
      </div>
     </div>
    );
  }
}

export default SignInPage;
