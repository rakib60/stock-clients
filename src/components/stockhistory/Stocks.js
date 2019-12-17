import React, {Component} from 'react'
import stockApi from '../../api/StockApi'
import * as _ from "lodash";

import {Col, Row } from  'react-bootstrap'

import MUIDataTable from "mui-datatables";

export class Stocks extends Component {


    constructor(props) {
        super(props);
        this.state = {stocks: [], alert: null}
        this.getData = this.getData.bind(this)
        this.columns = []
        this.data = []
    }
    componentDidMount() {
        this.refreshList()
    }



    async refreshList () {
        const response =  await stockApi.get('/stocks');
        this.setState({stocks: response.data})

    }
    

    getData(data) {
        this.setState({stocks: data})
    }

    render() {
        const {stocks} = this.state;

        this.columns = [
            {
                name: "Product ID",
                options: {
                    filter: true
                }
            },
            {
                name: "Product Name",
                options: {
                    filter: true
                }
            },
            {
                name: "Product Category",
                options: {
                    filter: true
                }
            },
            {
                name: "Product Desc.",
                options: {
                    filter: true
                }
            },

            {
                name: "InQuantity",
                options: {
                    filter: true
                }
            },
            {
                name: "OutQuantity",
                options: {
                    filter: true
                }
            },
            {
                name: "Current Quantity",
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
            <h5>Stocks History</h5>
            <br/>
            <MUIDataTable
                title={"Stocks"}
                data={
                    stocks.map(product => {
                        if ( !_.isEmpty(product.stockOuts)) {
                            var iterator = product.stockOuts.values()
                                var totalOutQuantity = 0
                                for(let key of iterator ) {
                                    totalOutQuantity += key.outQuantity
                                }
                            
                            
                        }

                        if ( !_.isEmpty(product.stockIns)) {
                            var data = product.stockIns.values()
                                var totalInQuantity = 0
                                for(let key of data ) {
                                    totalInQuantity += key.inQuantity
                                }
                            
                            
                        }
                        return [
                            product.id,
                            product.name,
                            product.category.name,
                            product.description,
                            _.isEmpty(product.stockIns) ? 0: totalInQuantity,
                            _.isEmpty(product.stockOuts) ? 0: totalOutQuantity,
                            (_.isEmpty(product.stockIns) ? 0: totalInQuantity )- (_.isEmpty(product.stockOuts) ? 0: totalOutQuantity)


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

