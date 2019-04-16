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


class Consumer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            purchase_upc: '',
            purchase_price: '',
            drink_upc: '',
            snackOpen: false,
            snackText: '',
            isConsumer: false
        };
    }

    componentDidMount = async () => {
        this.props.contract.events.Purchased({}, this.newEvent);
        this.props.contract.events.Drunk({}, this.newEvent);
        this.checkIsConsumer();
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

    handlePurchase = async (event) => {
        let amount = this.props.web3.utils.toWei(this.state.purchase_price);
        this.props.contract.methods.purchaseWine(parseInt(this.state.purchase_upc)).send({from: this.props.accounts[0], value: amount});
    }

    handleDrink = async (event) => {
        this.props.contract.methods.drinkWine(parseInt(this.state.drink_upc)).send({from: this.props.accounts[0]});
    }

    checkIsConsumer = async (event) => {
        let isConsumer = await this.props.contract.methods.isConsumer(this.props.accounts[0]).call();
        console.log(isConsumer);
        this.setState({
            isConsumer
        });
    }

    render() {
        const { classes } = this.props;

        return(
            <div>
                {this.state.isConsumer && (
                    <div>
                        <Chip label="You are a Consumer" className={classes.chip} />
                    </div>
                )}
                {!this.state.isConsumer && (
                    <div>
                        <Chip label="You are not a Consumer" className={classes.errorChip} />
                    </div>
                )}
                <div style={{margin: 20}}>
                    <h3>
                        Purchase Wine
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
                                    value={this.state.purchase_upc}
                                    onChange={this.handleChange('purchase_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="Purchase Price (in ETH)"
                                    placeholder="Purchase Price (in ETH)"
                                    className={classes.textField}
                                    value={this.state.purchase_price}
                                    onChange={this.handleChange('purchase_price')}
                                    type="number"
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handlePurchase} className={classes.button}>
                                    Purchase Wine
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/> 
                <div style={{margin: 20}}>
                    <h3>
                        Drink Wine
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
                                    value={this.state.drink_upc}
                                    onChange={this.handleChange('drink_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleDrink} className={classes.button}>
                                    Drink Wine
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

Consumer.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Consumer);

