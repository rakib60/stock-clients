import { CSVLink } from "react-csv";
import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Tooltip from '@material-ui/core/Tooltip';

import stockApi from '../../api/StockApi'


export default class RequisitionDownloads extends Component {
    constructor(props) {
        super(props);
        this.state = {requisition: []}

    }
    componentDidMount() {
        this.refreshList()
    }

    async refreshList () {
        const response =  await stockApi.get(`/requisition/`);
        this.setState({requisition: response.data})
    }

    render() {
        const {requisition} = this.state;

        const headers = [
            { label: "ID", key: "id" },
            { label: "Number", key: "number" },
            { label: "Location", key: "location"},
            { label: "Status", key: "submittedStatus"}
          ];
        
        const csvData = []
        for (let i = 0; i < requisition.length; i++ ) {
            var submittedStatus = requisition[i] && requisition[i].status === 0 ? 'Pending' : 'Approved'
            var data = requisition[i]
            let {id, number, location} = data;
            csvData.push({
                id,
                number,
                location,
                submittedStatus
            })
          }

      return (
        <div>
          <CSVLink 
            data={csvData}
            headers={headers}
            filename={"Requisition List.csv"}>
            <Button variant="secondarys"> 
                <Tooltip title="Download" aria-label="Download">
                    <CloudDownloadIcon/>
                </Tooltip></Button>
          </CSVLink>
        </div>
      );
    }
  }