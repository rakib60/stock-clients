import React, {Component} from 'react'
import { Table } from 'react-bootstrap'
import stockApi from '../api/StockApi'

import {Button, ButtonToolbar} from 'react-bootstrap'
import {AddCategoryModal} from './AddCategoryModal'
import {EditCategoryModal} from './EditCategoryModal'
import SweetAlert from 'react-bootstrap-sweetalert';

import MUIDataTable from "mui-datatables";


export class Category extends Component {


    constructor(props) {
        super(props);
        this.state = {categories: [], addModalShow: false, editModalShow: false, alert: null, activePage:15}
        this.getData = this.getData.bind(this)
        this.columns = []
        this.data = []
    }
    componentDidMount() {
        this.refreshList()
    }
    
    async refreshList () {
        const response =  await stockApi.get('/categories');
        this.setState({categories: response.data})

    }
    
    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    getData(data) {
        this.setState({categories: data})
    }

    async deleteFile(cid) {
              
        try {
                await stockApi.delete(`/categories/${cid}`) 
            } catch(error) {
                alert('This Category is assocciated with Product')
            }
        this.setState({ alert: null});
    }

    async delCategory(CId) {

        const getAlert = () => (
            
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure?"
            onConfirm={()=> this.deleteFile(CId)}
            onCancel={()=> this.hideAlert()}
            focusCancelBtn
            >
            Are you want to delete Category
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

        const {categories, cId, cName} = this.state;
        let addModalClose =() => this.setState({addModalShow: false})
        let editModalClose =() => this.setState({editModalShow: false})
        // this.deleteFile()
        this.columns = ['CategoryID','DepartmentName',]
        if(categories) {
            // Object.values(categories)
            this.data = categories
        }
        // this.data = categories
        console.log(this.data,'dsfsfsdfsf')
        return (
            <div>
                <MUIDataTable
                title={"Category List"}
                data={this.data}
                columns={this.columns}
                
                />
                {/* <Table className="mt-4" striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>CategoryID</th>
                        <th>DepartmentName</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category=> 
                        <tr key ={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>
                                <ButtonToolbar>
                                    <Button className="mr-2" variant="info"
                                    onClick={()=> this.setState({editModalShow:true, cId:category.id, cName:category.name})}
                                    >
                                        Edit
                                    </Button>
                                    <Button className="mr-2" variant="danger"
                                    onClick={()=> this.delCategory(category.id)}
                                    >{this.state.alert}
                                        Delete
                                    </Button>
                                    <EditCategoryModal
                                        show= {this.state.editModalShow}
                                        onHide={editModalClose}
                                        cid={cId}
                                        cname={cName}

                                    />
                                </ButtonToolbar>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table> */}

            <ButtonToolbar>
                <Button 
                variant="primary" 
                onClick={()=> this.setState({addModalShow: true})}>
                    Add Category
                </Button>
                <AddCategoryModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}
                    getdata={this.getData}
                />
            </ButtonToolbar>
            </div>
        )
    }
}

