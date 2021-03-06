import React, {Component} from 'react'
import stockApi from '../../api/StockApi'

import {Button, ButtonToolbar} from 'react-bootstrap'
import {AddProductModal} from './AddProductModal'
import {EditProductModal} from './EditProductModal'
import SweetAlert from 'react-bootstrap-sweetalert';
import {Col, Row } from  'react-bootstrap'

import MUIDataTable from "mui-datatables";

export class Product extends Component {


    constructor(props) {
        super(props);
        this.state = {products: [], addModalShow: false, editModalShow: false, alert: null}
        this.getData = this.getData.bind(this)
        this.columns = []
        this.data = []
    }
    componentDidMount() {
        this.refreshList()
    }



    async refreshList () {
        const response =  await stockApi.get('/products');
        this.setState({products: response.data})

    }
    

    getData(data) {
        this.setState({products: data})
    }

    async deleteFile(pId) {  
        try {
                await stockApi.delete(`/products/${pId}`) 
            } catch(error) {
                alert('This Product is assocciated with Product')
            }
        
        const getData = await stockApi.get('/products');

        this.setState({ alert: null, products: getData.data});
    }

    async delProduct(pId) {
        const getAlert = () => (
            
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure?"
            onConfirm={()=> this.deleteFile(pId)}
            onCancel={()=> this.hideAlert()}
            focusCancelBtn
            >
            Are you want to delete Product
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
        const {products, pId, pName, pDes, cId} = this.state;

        let addModalClose =() => this.setState({addModalShow: false})
        let editModalClose =() => this.setState({editModalShow: false})

        this.columns = [
            {
                name: "ProductID",
                options: {
                    filter: true
                }
            },
            {
                name: "ProductName",
                options: {
                    filter: true
                }
            },
            {
                name: "ProductDesc.",
                options: {
                    filter: true
                }
            },
            {
                name: "CategoryName",
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
                    Add Product
                </Button>
                <AddProductModal
                    show={this.state.addModalShow}
                    onHide={addModalClose}
                    getdata={this.getData}
                />
            </ButtonToolbar>
            <br/>
            <MUIDataTable
                title={"Product List"}
                data={
                    products.map(Product => {
                        return [
                            Product.id,
                            Product.name,
                            Product.description,
                            Product.category.name,
                            <ButtonToolbar>
                            <Button className="mr-2" variant="info"
                            onClick={()=> this.setState({editModalShow:true, pId:Product.id, pName: Product.name, pDes:Product.description,  cId:Product.category.id})}
                            >
                                Edit
                            </Button>
                            <Button className="mr-2" variant="danger"
                            onClick={()=> this.delProduct(Product.id)}
                            >
                                {this.state.alert}
                                Delete
                            </Button>
                            <EditProductModal
                                show= {this.state.editModalShow}
                                onHide={editModalClose}
                                getdata={this.getData}
                                pid={pId}
                                pname={pName}
                                pdes={pDes}
                                cid={cId}

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

