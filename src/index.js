import React from 'react';

import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './index.css';

const useStyles = makeStyles(theme => ({
    header: {
        marginBottom: theme.spacing(3)
    },
    card: {
        marginRight: theme.spacing(2)
    }
}))

function Header(props) {
    const css = useStyles()
    return (
        <Typography className={css.header} variant="h1" align="center">Listings</Typography>

    )
}

function Listing(props) {
    const css = useStyles()
    return (
        <Grid>
            <Card className={css.card}>
                <CardContent>
                    <Typography variant="h4">
                        {props.title}
                    </Typography>
                    <Typography variant="h5">
                        Current bid: ${props.current_bid}
                    </Typography>
                </CardContent>
            </Card>
            
        </Grid>
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
                <Header></Header>
                <Grid container justify="center" spacing={2}>
                    {auction}
                </Grid>
                    
                
            </div>
        )
    }
}

ReactDOM.render(
    <Main />,
    document.getElementById('root')
  );
  