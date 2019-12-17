import React, {Component} from 'react'
import stockApi from '../../api/StockApi'

import {Button, ButtonToolbar} from 'react-bootstrap'
import {AddUserModal} from './AddUserModal'
import {EditUserModal} from './EditUserModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import {Col, Row } from  'react-bootstrap'

import MUIDataTable from "mui-datatables";

export class User extends Component {


    constructor(props) {
        super(props);
        this.state = {users: [], addModalShow: false, editModalShow: false, alert: null}
        this.getData = this.getData.bind(this)
        this.columns = []
        this.data = []
        // el.onclick = function() {
        //     var main = document.querySelector('.MUIDataTableToolbar-actions-46');
        //     console.log(main,'dskflsdf')
        // }


    }
    componentDidMount() {
        this.refreshList()
    }



    async refreshList () {
        const response =  await stockApi.get('/users');
        this.setState({users: response.data})

    }
    

    getData(data) {
        this.setState({users: data})
    }

    async deleteFile(uid) {  
        try {
                await stockApi.delete(`/users/${uid}`) 
            } catch(error) {
                alert('This User can not be deleted')
            }
        
        const getData = await stockApi.get('/users');

        this.setState({ alert: null, users: getData.data});
    }

    async delUser(uId) {

        const getAlert = () => (
            
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure?"
            onConfirm={()=> this.deleteFile(uId)}
            onCancel={()=> this.hideAlert()}
            focusCancelBtn
            >
            Are you want to delete User
            </SweetAlert>
          );
      
        this.setState({
        alert: getAlert()
        });

    }

    hideAlert() {
        this.setState({
          alert: null
        });
      }

    render() {
        const {users, uId, fName, lName, email, isAdmin, password} = this.state;
        let addModalClose =() => this.setState({addModalShow: false})
        let editModalClose =() => this.setState({editModalShow: false})

    

        this.columns = [
            {
                name: "UserID",
                options: {
                    filter: true
                }
            },
            {
                name: "FirstName",
                options: {
                    filter: true
                }
            },
            {
                name: "LastName",
                options: {
                    filter: true
                }
            },
            {
                name: "email",
                options: {
                    filter: true
                }
            },
            {
                name: "User Status",
                options: {
                    filter: true
                }
            },
            {
                name: "Actions",
                options: {
                    filter: false
                }
            }
        ]
        const options ={
            selectableRows: 'none',
            download: false,
            print: false,
            responsive: 'scrollMaxHeight'

        }
        return (
           <Row>
            <Col>
            <br/>
            <ButtonToolbar>
                <Button 
                variant="primary" 
                onClick={()=> this.setState({addModalShow: true})}>
                    Add User
                </Button>
                <AddUserModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}
                    getdata={this.getData}
                />
            </ButtonToolbar>
            <br/>
            <MUIDataTable
                title={"User List"}
                data={
                    users.map(User => {
                        return [
                            User.id,
                            User.firstName,
                            User.lastName,
                            User.email,
                            User.isAdmin && User.isAdmin === 1 ? 'User' : "Admin",
                          <ButtonToolbar>
                            <Button className="mr-2" variant="info"
                            onClick={()=> this.setState({editModalShow:true, uId: User.id, fName: User.firstName, lName: User.lastName,email: User.email, isAdmin: User.isAdmin, password: User.password})}
                            >
                                Edit
                            </Button>
                            <Button className="mr-2" variant="danger"  
                            disabled={User.isAdmin=== 2}
                            onClick={()=> this.delUser(User.id)}
                            >
                                {this.state.alert}
                                Delete
                            </Button>
                            <EditUserModal
                                show= {this.state.editModalShow}
                                onHide={editModalClose}
                                getdata={this.getData}
                                uid={uId}
                                fname={fName}
                                lname={lName}
                                email={email}
                                isadmin={isAdmin}
                                password={password}
                            />
                         </ButtonToolbar>
                        ]
                    }
                )
                }
                columns={this.columns}
                options={options}
                
                />
                <br/>
            </Col>
            </Row>
        )
    }
}

