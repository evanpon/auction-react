import React from 'react';

import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import './index.css';

function Listing(props) {
    return (
        <li >
            <Card>
                <CardContent>
                    <h3>
                        {props.title}
                    </h3>
                    <h5>
                        {props.current_bid}
                    </h5>
                </CardContent>
            </Card>
            
        </li>
    )
}

class Main extends React.Component {
    ws = new WebSocket('wss://2e2r60d730.execute-api.us-west-2.amazonaws.com/dev')
    constructor(props) {
        super(props)
        this.state = {
            listings: []
        }
    }

    componentDidMount() {
        this.ws.onopen = () => {
            console.log('connected')
            this.ws.send('{"action":"refresh"}')
        }
        this.ws.onmessage = evt => {
            console.log("data: " + evt.data)
            
            const message = JSON.parse(evt.data)
            this.setState({listings: message})
        }
    }
    render() {
        const listings = this.state.listings
        const auction = listings.map((listing) => {
            return (                
                <Listing key={listing["title"]} title={listing["title"]} current_bid={listing["current_bid"]}>

                </Listing>
            )
        })
        return (
            <div>
                <h1>Listings</h1>
                <ul>
                    {auction}
                </ul>
            </div>
        )
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('root')
  );
  