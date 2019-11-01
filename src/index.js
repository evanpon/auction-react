import React from 'react';

import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './index.css';
import { CardMedia, CardActionArea } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { useFormik} from "formik";

const useStyles = makeStyles(theme => ({
    header: {
        marginBottom: theme.spacing(3)
    },
    card: {
        marginRight: theme.spacing(2),
        width: 220, 
        height: 330
    },
    media: {
        height: 140
    }
}))

const BidForm = (props) => {
    const formik = useFormik({
        initialValues: { bid_amount: "", title: props.title },
        onSubmit: props.on_submit
      });
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="bid">Bid</label>
            <input
            name="bid_amount"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.bid}
            />
            <input name="title" type="hidden"  />

            <button type="submit">Submit</button>
        </form>
    );
  };

function Header(props) {
    const css = useStyles()
    return (
        <div>
            <Typography className={css.header} variant="h3" align="center">Listings</Typography>
        </div>
    )
}

function Listing(props) {
    const css = useStyles()

    return (
        <Grid>
            <Card className={css.card}>
                <CardActionArea>
                    <CardMedia className={css.media} image="https://images.squarespace-cdn.com/content/v1/5c9a8924a9ab95361f669dda/1566412031677-4EEMU1TXKFK8GSXQWYYS/ke17ZwdGBToddI8pDm48kEMi4onvyUOR0Qtebu3yCw0UqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYwL8IeDg6_3B-BRuF4nNrNcQkVuAT7tdErd0wQFEGFSnO5isBYjd2p2RhLWxVTYiBUDYtTshBgZinKwV9ikjRUf-fpLn81pdpzQN2ithFJlAQ/house+%26+mountain+copy+small.jpg" title="La Minita"></CardMedia>

                </CardActionArea>
                <CardContent>
                    <Typography variant="h5">
                        {props.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Current bid: ${props.current_bid}
                        <br />
                        Lot size: 100 bags
                        <br />
                        Origin: Churupampa
                    </Typography>
                </CardContent>
                <CardActions >
                    <Grid container justify="flex-end">
                        <BidForm title={props.title} on_submit={props.on_submit}></BidForm>

                        <Button size="medium" variant="contained" color="secondary" direction="row">
                            Bid
                        </Button>
                    </Grid>
                </CardActions>
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
        this.onSubmit = this.onSubmit.bind(this)
    }

    componentDidMount() {
        this.ws.onopen = () => {
            this.ws.send('{"action":"refresh"}')
        }
        this.ws.onmessage = evt => {
            
            const message = JSON.parse(evt.data)
            this.setState({listings: message})
        }
    }

    onSubmit(values) {
        const payload = {
            action: "bid",
            title: values.title,
            bid_amount: values.bid_amount,
            contact_info: 'Evan'     
        }
        console.log("payload: " + JSON.stringify(payload))
        this.ws.send(JSON.stringify(payload))
        console.log(values)
    }

    render() {
        const listings = this.state.listings
        const auction = listings.map((listing) => {
            return (                
                <Listing on_submit={this.onSubmit} key={listing["title"]} title={listing["title"]} current_bid={listing["current_bid"]}>

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
  