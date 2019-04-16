import React, { Component } from 'react';
import logo from './logo.svg';
import getWeb3 from "./utils/getWeb3";
import Winemaker from "./components/Winemaker";
import WineMerchant from "./components/WineMerchant";
import Consumer from "./components/Consumer";
import WineInfos from "./components/WineInfos";
import Admin from "./components/Admin";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, Tab, Tabs, Typography } from '@material-ui/core';
import SupplyChain from "./contracts/SupplyChain.json";
import './App.css';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class App extends Component {
  // Init the state of the app
  state = { 
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null, 
    value: 0,
  };

  // When the compnent mount we init all the web3 variables
  componentDidMount = async () => {
    try {

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SupplyChain.networks[networkId];
      console.log(deployedNetwork);
      const instance = new web3.eth.Contract(
        SupplyChain.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ 
        web3, 
        accounts, 
        contract: instance, 
      });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };


  render() {
    const { classes } = this.props;
    const { value } = this.state;

    if(!this.state.web3){
      return <div>Loading Web3</div>
    }
    else {
      return (
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Winemaker" />
              <Tab label="Wine Merchant" />
              <Tab label="Consumer" />
              <Tab label="Wine infos" />
              <Tab label="Admin" />
            </Tabs>
          </AppBar>
          {value === 0 && <Winemaker contract={this.state.contract} web3={this.state.web3} accounts={this.state.accounts}/>}
          {value === 1 && <WineMerchant contract={this.state.contract} web3={this.state.web3} accounts={this.state.accounts}/>}
          {value === 2 && <Consumer contract={this.state.contract} web3={this.state.web3} accounts={this.state.accounts}/>}
          {value === 3 && <WineInfos contract={this.state.contract} web3={this.state.web3} accounts={this.state.accounts}/>}
          {value === 4 && <Admin contract={this.state.contract} web3={this.state.web3} accounts={this.state.accounts}/>}
        </div>
      );
    }

    
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);;
