import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Form } from  'react-bootstrap'
import {NavLink} from 'react-router-dom'

import './signupPage.css'
import stockApi from '../../api/StockApi'

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



class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      selectedOption: "1",
      password: '',
      confrimPassword: '',
      errorMessage: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOptionChange = changeEvent => {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  };

  async handleSubmit(event) {
    event.preventDefault()
    const {firstname, lastname, email, selectedOption, password, confrimPassword} = this.state;

    if(password !== confrimPassword) {
        alert("Passwords don't match")
    } else {
        var data = {
            id:null,
            firstName:firstname,
            lastName:lastname,
            email,
            isAdmin: Number(selectedOption),
            password
        }
    }
    
    try {
        await stockApi.post('/users', data);
    } catch(error) {
        alert('Failed User email already exists')
     }
    
}

  render() {

    return (
      <div className="fullscreen-wrapper">
        <FormContainer>
          <Heading>Join us!</Heading>
          <p>Start managing stocks easily.</p>

          <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="FirstName">
              <Form.Label>FirstName</Form.Label>
              <Form.Control
                  type="text"
                  name="FirstName"
                  required
                  placeholder="First Name"
                  autoComplete="off"
                  onChange={e => this.setState({ firstname: e.target.value })}

              />
          </Form.Group>
          <Form.Group controlId="LastName">
              <Form.Label>LastName</Form.Label>
              <Form.Control
                  type="text"
                  name="LastName"
                  required
                  placeholder="Last Name"
                  autoComplete="off"
                  onChange={e => this.setState({ lastname: e.target.value })}
              />
          </Form.Group>
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

          <div className="mb-2" style={{display: 'flex'}}>
              User type: 
                    <div className="form-check" style={{paddingLeft: '30px'}} >
                      <label>
                        <input
                            type="radio"
                            name="user"
                            value="1"
                            checked={this.state.selectedOption === "1"}
                            onChange={this.handleOptionChange}
                            className="form-check-input"
                        />
                      User
                      </label>
                  </div>
                    <div className="form-check" style={{paddingLeft: '30px'}}>
                      <label>
                      <input
                          type="radio"
                          name="admin"
                          value="2"
                          checked={this.state.selectedOption === "2"}
                          onChange={this.handleOptionChange}
                          className="form-check-input"
                      />
                      Admin
                      </label>
                    </div>
            </div>

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
          <Form.Group controlId="ConfrimPassword">
              <Form.Label>Confrim Password</Form.Label>
              <Form.Control
                  type="password"
                  name="confrimPassword"
                  required
                  placeholder="xxxxxxxxxx"
                  autoComplete="off"
                  onChange={e => this.setState({ confrimPassword: e.target.value })}
              />
          </Form.Group>
          <Form.Group>
              <Button variant="primary" type="submit">SIGN UP</Button>
          </Form.Group>
      </Form>
        <p>If you have an existing account ?<NavLink className="d-inline p-2 bg-green text-blue"
                    to="/signin">Sign in</NavLink></p>
        </FormContainer>
      </div>
    );
  }
}

export default SignUpPage;
