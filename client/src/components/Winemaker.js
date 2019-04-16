import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Divider, Button, TextField, Snackbar, Chip } from "@material-ui/core";
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


class Winemaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            make_upc: '',
            make_name: '',
            make_infos: '',
            make_lat: '',
            make_long: '',
            make_prod_infos: '',
            age_upc: '',
            age_month: '',
            bottle_upc:'',
            pack_upc: '',
            sell_upc: '',
            sell_price: '',
            ship_upc: '',
            snackOpen: false,
            snackText: '',
            isWinemaker: false
        };
    }

    componentDidMount = async () => {
        this.props.contract.events.Made({}, this.newEvent);
        this.props.contract.events.Aged({}, this.newEvent);
        this.props.contract.events.Bottled({}, this.newEvent);
        this.props.contract.events.Packed({}, this.newEvent);
        this.props.contract.events.ForSale({}, this.newEvent);
        this.props.contract.events.Shipped({}, this.newEvent);
        this.checkIsWinemaker();
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

    handleClose = () => {
        this.setState({
            snackOpen: false
        });
    }

    handleMake = (event) => {
        this.props.contract.methods.makeWine(parseInt(this.state.make_upc), this.state.make_name, this.state.make_infos, this.state.make_lat, this.state.make_long, this.state.make_prod_infos).send({from: this.props.accounts[0]});
    }

    handleAged = (event) => {
        this.props.contract.methods.ageWine(parseInt(this.state.age_upc), parseInt(this.state.age_month)).send({from: this.props.accounts[0]});
    }

    handleBottled = (event) => {
        this.props.contract.methods.bottleWine(parseInt(this.state.bottle_upc)).send({from: this.props.accounts[0]});
    }

    handlePacked = (event) => {
        this.props.contract.methods.packWine(parseInt(this.state.pack_upc)).send({from: this.props.accounts[0]});
    }

    handleSell = (event) => {
        const weiPrice = this.props.web3.utils.toWei(this.state.sell_price);
        console.log(weiPrice);
        this.props.contract.methods.sellWine(parseInt(this.state.sell_upc), weiPrice).send({from: this.props.accounts[0]});
    }

    handleShip = (event) => {
        this.props.contract.methods.shipWine(parseInt(this.state.ship_upc)).send({from: this.props.accounts[0]});
    }

    checkIsWinemaker= async (event) => {
        let isWinemaker = await this.props.contract.methods.isWinemaker(this.props.accounts[0]).call();
        console.log(isWinemaker);
        this.setState({
            isWinemaker
        });
    }

    render() {
        const { classes } = this.props;

        return(
            <div>
                {this.state.isWinemaker && (
                    <div>
                        <Chip label="You are a Winemaker" className={classes.chip} />
                    </div>
                )}
                {!this.state.isWinemaker && (
                    <div>
                        <Chip label="You are not a Winemaker" className={classes.errorChip} />
                    </div>
                )}
                <div style={{margin: 20}}>
                    <h3>
                        Make Wine
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
                                    value={this.state.make_upc}
                                    onChange={this.handleChange('make_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="Winemaker Name"
                                    placeholder="Winemaker Name"
                                    className={classes.textField}
                                    value={this.state.make_name}
                                    onChange={this.handleChange('make_name')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="Winemaker Infos"
                                    placeholder="Winemaker Infos"
                                    className={classes.textField}
                                    value={this.state.make_infos}
                                    onChange={this.handleChange('make_infos')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="Winemaker Latitude"
                                    placeholder="Winemaker Latitude"
                                    className={classes.textField}
                                    value={this.state.make_lat}
                                    onChange={this.handleChange('make_lat')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="Winemaker Longitude"
                                    placeholder="Winemaker Longitude"
                                    className={classes.textField}
                                    value={this.state.make_long}
                                    onChange={this.handleChange('make_long')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="Product infos"
                                    placeholder="Product infos"
                                    className={classes.textField}
                                    value={this.state.make_prod_infos}
                                    onChange={this.handleChange('make_prod_infos')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleMake} className={classes.button}>
                                    Make Wine
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/> 
                <div style={{margin: 20}}>
                    <h3>
                        Age Wine
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
                                    value={this.state.age_upc}
                                    onChange={this.handleChange('age_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="Months aged"
                                    placeholder="Month Aged"
                                    type="number"
                                    className={classes.textField}
                                    value={this.state.age_month}
                                    onChange={this.handleChange('age_month')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleAged} className={classes.button}>
                                    Age Wine
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/> 
                <div style={{margin: 20}}>
                    <h3>
                        Bottle Wine
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
                                    value={this.state.bottle_upc}
                                    onChange={this.handleChange('bottle_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleBottled} className={classes.button}>
                                    Bottle Wine
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/> 
                <div style={{margin: 20}}>
                    <h3>
                        Pack Wine
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
                                    value={this.state.pack_upc}
                                    onChange={this.handleChange('pack_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handlePacked} className={classes.button}>
                                    Pack Wine
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/> 
                <div style={{margin: 20}}>
                    <h3>
                        Sell Wine
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
                                    value={this.state.sell_upc}
                                    onChange={this.handleChange('sell_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="standard-name"
                                    label="Sell Price (in ETH)"
                                    placeholder="Sell Price (in ETH)"
                                    className={classes.textField}
                                    value={this.state.sell_price}
                                    type="number"
                                    onChange={this.handleChange('sell_price')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleSell} className={classes.button}>
                                    Sell Wine
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/> 
                <div style={{margin: 20}}>
                    <h3>
                        Ship Wine
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
                                    value={this.state.ship_upc}
                                    onChange={this.handleChange('ship_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleShip} className={classes.button}>
                                    Ship Wine
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/> 
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

Winemaker.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Winemaker);

