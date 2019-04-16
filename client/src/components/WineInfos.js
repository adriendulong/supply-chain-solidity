import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Grid, Divider, Button, Dialog, AppBar, Toolbar, IconButton, Slide, TextField, Chip, Link, Snackbar } from "@material-ui/core";
import '../App.css';

const wineStates = {
    0: "Made",
    1: "Aged",
    2: "Bottled",
    3: "Packed",
    4: "ForSale",
    5: "Sold",
    6: "Shipped",
    7: "Received",
    8: "ForPurchase",
    9: "Purchased",
    10: "Drunk"
}

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
      lineContainer: {
          margin: 20
      },
      gridLabel: {
          marginRight: 20
      },
      button: {
          margin: 30
      }
  });


class WineInfos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wine_upc: '',
            infosOne: null,
            infosTwo: null
        };
    }

    componentDidMount = async () => {
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleInfos = async (event) => {
        console.log("Make");
        let infosOne = await this.props.contract.methods.fetchWineBufferOne(this.state.wine_upc).call();
        console.log(infosOne);
        let infosTwo = await this.props.contract.methods.fetchWineBufferTwo(this.state.wine_upc).call();
        console.log(infosTwo);
        this.setState({
            infosOne,
            infosTwo
        });

    }

    render() {
        const { classes } = this.props;

        return(
            <div>
                <div style={{margin: 20}}>
                    <h3>
                        Get Wine Infos
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
                                    value={this.state.wine_upc}
                                    onChange={this.handleChange('wine_upc')}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={this.handleInfos} className={classes.button}>
                                    Get Wine Infos
                               </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div> 
                <Divider/>
                {this.state.infosOne && (
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="baseline"
                            className={classes.lineContainer}
                        >
                            <Grid item className={classes.gridLabel}>
                                Winemaker name :
                            </Grid>
                            <Grid item>
                                {this.state.infosOne.originWinemakerName}
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            className={classes.lineContainer}
                        >
                            <Grid item className={classes.gridLabel}>
                                Owner Id :
                            </Grid>
                            <Grid item>
                                {this.state.infosOne.ownerID}
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            className={classes.lineContainer}
                        >
                            <Grid item className={classes.gridLabel}>
                                Months Aged :
                            </Grid>
                            <Grid item>
                                {this.state.infosTwo.monthsAged.toNumber()}
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            className={classes.lineContainer}
                        >
                            <Grid item className={classes.gridLabel}>
                                Product notes :
                            </Grid>
                            <Grid item>
                                {this.state.infosTwo.productNotes}
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            className={classes.lineContainer}
                        >
                            <Grid item className={classes.gridLabel}>
                                Product Price :
                            </Grid>
                            <Grid item>
                                {this.props.web3.utils.fromWei(this.state.infosTwo.productPrice.toString())} ETH
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            className={classes.lineContainer}
                        >
                            <Grid item className={classes.gridLabel}>
                                Consumer Price :
                            </Grid>
                            <Grid item>
                                {this.props.web3.utils.fromWei(this.state.infosTwo.productFinalPrice.toString())} ETH
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            className={classes.lineContainer}
                        >
                            <Grid item className={classes.gridLabel}>
                                Wine State :
                            </Grid>
                            <Grid item>
                                {wineStates[this.state.infosTwo.wineState.toNumber()]}
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </div>
        );
    }
}

WineInfos.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(WineInfos);

