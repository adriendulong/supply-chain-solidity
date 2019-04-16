import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid, Divider, Button, Dialog, AppBar, Toolbar, IconButton, Slide, TextField, Chip, Link, Snackbar } from "@material-ui/core";
import '../App.css';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
      },
      button: {
          margin: 30
      },
      chip: {
        margin: theme.spacing.unit,
        backgroundColor: 'green',
        color: 'white'
      },
      errorChip: {
        margin: theme.spacing.unit,
        backgroundColor: 'red',
        color: 'white'
      }
  });


class WineMerchant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buy_upc: '',
            buy_price: '',
            receive_upc: '',
            for_purchase_upc: '',
            for_purchase_price: '',
            snackOpen: false,
            snackText: '',
            isWineMerchant: false
        };
    }

    componentDidMount = async () => {
        this.props.contract.events.Sold({}, this.newEvent);
        this.props.contract.events.Received({}, this.newEvent);
        this.props.contract.events.ForPurchase({}, this.newEvent);
        this.checkIsWineMerchant();
    }

    handleClose = () => {
        this.setState({
            snackOpen: false
        });
    }

    newEvent = (error, result) => {
        this.setState({
            snackOpen: true,
            snackText: `Transaction ${result.transactionHash} for "${result.event}" confirmed`
        });
        console.log(result);
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleBuy = async (event) => {
        let amountWei = this.props.web3.utils.toWei(this.state.buy_price);
        this.props.contract.methods.buyWine(parseInt(this.state.buy_upc)).send({from: this.props.accounts[0], value: amountWei});
    }

    handleReceive = async (event) => {
        this.props.contract.methods.receiveWine(parseInt(this.state.receive_upc)).send({from: this.props.accounts[0]});
    }

    handleForPurchase = async (event) => {
        let amountWei = this.props.web3.utils.toWei(this.state.for_purchase_price);
        this.props.contract.methods.setOnPurchaseWine(parseInt(this.state.for_purchase_upc), amountWei).send({from: this.props.accounts[0]});
    }

    checkIsWineMerchant= async (event) => {
        let isWineMerchant = await this.props.contract.methods.isWineMerchant(this.props.accounts[0]).call();
        console.log(isWineMerchant);
        this.setState({
            isWineMerchant
        });
    }

    render() {
        const { classes } = this.props;

        return(
            <div>
                {this.state.isWineMerchant && (
                    <div>
                        <Chip label="You are a Wine Merchant" className={classes.chip} />
                    </div>
                )}
                {!this.state.isWineMerchant && (
                    <div>
                        <Chip label="You are not a Wine Merchant" className={classes.errorChip} />
                    </div>
                )}
                <div style={{margin: 20}}>
                    <h3>
                        Buy Wine
                    </h3>
                    <form className={classes.container} noValidate autoComplete="off">
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="UPC"
                                    placeholder="UPC"
                                    className={classes.textField}
                                    value={this.state.buy_upc}
                                    onChange={this.handleChange('buy_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="Buy Price (in ETH)"
                                    placeholder="Buy Price (in ETH)"
                                    className={classes.textField}
                                    value={this.state.buy_price}
                                    onChange={this.handleChange('buy_price')}
                                    type="number"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleBuy} className={classes.button}>
                                    Buy Wine
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/> 
                <div style={{margin: 20}}>
                    <h3>
                        Receive Wine
                    </h3>
                    <form className={classes.container} noValidate autoComplete="off">
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="UPC"
                                    placeholder="UPC"
                                    className={classes.textField}
                                    value={this.state.receive_upc}
                                    onChange={this.handleChange('receive_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleReceive} className={classes.button}>
                                    Receive Wine
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/> 
                <div style={{margin: 20}}>
                    <h3>
                        Available for purchase
                    </h3>
                    <form className={classes.container} noValidate autoComplete="off">
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="UPC"
                                    placeholder="UPC"
                                    className={classes.textField}
                                    value={this.state.for_purchase_upc}
                                    onChange={this.handleChange('for_purchase_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="Purchase price (in ETH)"
                                    placeholder="Purchase price (in ETH)"
                                    className={classes.textField}
                                    value={this.state.for_purchase_price}
                                    onChange={this.handleChange('for_purchase_price')}
                                    type="number'"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleForPurchase} className={classes.button}>
                                    Set for purchase
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackOpen}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    message={<span id="message-id">{this.state.snackText}</span>}
                />
            </div>
        );
    }
}

WineMerchant.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(WineMerchant);

