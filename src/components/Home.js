import React, {Component} from 'react'
import { Stocks } from './stockhistory/Stocks'
export class Home extends Component {
    render() {
        return (
            <div>
                {/* <h3 style={{textAlign: "center"}}>Welcome to Stock Management.</h3> */}
                <Stocks/>
            </div>
            // <div className="mt-5 d-flex justify-content-right">
            //     <h3>Welcome to Stock Management.</h3>
            //     <Stocks/>
            // </div>
            
        )
    }
}