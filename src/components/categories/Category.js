import React, {Component} from 'react'
import stockApi from '../../api/StockApi'

import {Button, ButtonToolbar} from 'react-bootstrap'
import {AddCategoryModal} from './AddCategoryModal'
import {EditCategoryModal} from './EditCategoryModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import {Col, Row } from  'react-bootstrap'

import MUIDataTable from "mui-datatables";

export class Category extends Component {


    constructor(props) {
        super(props);
        this.state = {categories: [], addModalShow: false, editModalShow: false, alert: null}
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
    

    getData(data) {
        this.setState({categories: data})
    }

    async deleteFile(cid) {  
        try {
                await stockApi.delete(`/categories/${cid}`) 
            } catch(error) {
                alert('This Category is assocciated with Product')
            }
        
        const getData = await stockApi.get('/categories');

        this.setState({ alert: null, categories: getData.data});
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
        console.log('render')
        const {categories, cId, cName} = this.state;
        console.log(categories,'categories')
        let addModalClose =() => this.setState({addModalShow: false})
        let editModalClose =() => this.setState({editModalShow: false})

        this.columns = [
            {
                name: "CategoryID",
                options: {
                    filter: true
                }
            },
            {
                name: "DepartmentName",
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
                    Add Category
                </Button>
                <AddCategoryModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}
                    getdata={this.getData}
                />
            </ButtonToolbar>
            <br/>
            <MUIDataTable
                title={"Category List"}
                data={
                    categories.map(category => {
                        return [
                            category.id,
                            category.name,
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
                                getdata={this.getData}
                                cid={cId}
                                cname={cName}
                                

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

