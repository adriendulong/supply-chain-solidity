import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Divider, Button, TextField, Chip, Snackbar } from "@material-ui/core";
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


class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            winemaker_address: '',
            winemerchant_address: '',
            consumer_address: '',
            snackOpen: false,
            snackText: '',
            isOwner: false
        };
    }

    componentDidMount = async () => {
        this.props.contract.events.WinemakerAdded({}, this.newEvent);
        this.props.contract.events.WineMerchantAdded({}, this.newEvent);
        this.props.contract.events.ConsumerAdded({}, this.newEvent);
        this.props.contract.events.Paused({}, this.newEvent);
        this.props.contract.events.Unpaused({}, this.newEvent);

        this.checkOwnership();
        
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

    handleWinemaker = async (event) => {
        this.props.contract.methods.addWinemaker(this.state.winemaker_address).send({from: this.props.accounts[0]});
    }

    handleWineMerchant = async (event) => {
        this.props.contract.methods.addWineMerchant(this.state.winemerchant_address).send({from: this.props.accounts[0]});
    }

    handleConsumer = async (event) => {
        this.props.contract.methods.addConsumer(this.state.consumer_address).send({from: this.props.accounts[0]});
    }

    handlePause = async (event) => {
        this.props.contract.methods.pause().send({from: this.props.accounts[0]});
    }

    handleUnpause = async (event) => {
        this.props.contract.methods.unpause().send({from: this.props.accounts[0]});
    }

    checkOwnership = async (event) => {
        let isOwner = await this.props.contract.methods.isOwner().call({from: this.props.accounts[0]});
        console.log(isOwner);
        this.setState({
            isOwner
        });
    }

    render() {
        const { classes } = this.props;

        return(
            <div>
                {this.state.isOwner && (
                    <div>
                        <Chip label="You are the owner of the contract" className={classes.chip} />
                    </div>
                )}
                {!this.state.isOwner && (
                    <div>
                        <Chip label="You are not the owner of the contract" className={classes.errorChip} />
                    </div>
                )}
                
                <div style={{margin: 20}}>
                    <h3>
                        Add a winemaker
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
                                    label="Address"
                                    placeholder="Address"
                                    className={classes.textField}
                                    value={this.state.winemaker_address}
                                    onChange={this.handleChange('winemaker_address')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleWinemaker} className={classes.button}>
                                    Add winemaker
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/>
                <div style={{margin: 20}}>
                    <h3>
                        Add a wine merchant
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
                                    label="Address"
                                    placeholder="Address"
                                    className={classes.textField}
                                    value={this.state.winemerchant_address}
                                    onChange={this.handleChange('winemerchant_address')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleWineMerchant} className={classes.button}>
                                    Add wine merchant
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/>
                <div style={{margin: 20}}>
                    <h3>
                        Add a consumer
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
                                    label="Address"
                                    placeholder="Address"
                                    className={classes.textField}
                                    value={this.state.consumer_address}
                                    onChange={this.handleChange('consumer_address')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleConsumer} className={classes.button}>
                                    Add a consumer
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/>
                <div style={{margin: 20}}>
                    <h3>
                        Pause the contract
                    </h3>
                    <Button variant="contained" color="primary" onClick={this.handlePause} className={classes.button}>
                        Pause contract
                    </Button>
                </div> 
                <Divider/>
                <div style={{margin: 20}}>
                    <h3>
                        Unpause the contract
                    </h3>
                    <Button variant="contained" color="primary" onClick={this.handleUnpause} className={classes.button}>
                        Unpause contract
                    </Button>
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

Admin.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Admin);

