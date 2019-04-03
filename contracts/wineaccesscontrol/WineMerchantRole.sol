pragma solidity ^0.5.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'WineMerchantRole' to manage this role - add, remove, check
contract WineMerchantRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event WineMerchantAdded(address indexed account);
  event WineMerchantRemoved(address indexed account);

  // Define a struct 'wineMerchants' by inheriting from 'Roles' library, struct Role
  Roles.Role private wineMerchants;

  // In the constructor make the address that deploys this contract the 1st wine merchant
  constructor() public {
    _addWineMerchant(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyWineMerchant() {
    require(isWineMerchant(msg.sender), "WineMerchantRole::onlyWineMerchant - only a wine merchant can perform this action");
    _;
  }

  // Define a function 'isWineMerchant' to check this role
  function isWineMerchant(address account) public view returns (bool) {
    return wineMerchants.has(account);
  }

  // Define a function 'addWineMerchant' that adds this role
  function addWineMerchant(address account) public onlyWineMerchant {
    _addWineMerchant(account);
  }

  // Define a function 'renounceWineMerchant' to renounce this role
  function renounceWineMerchant() public {
    _removeWineMerchant(msg.sender);
  }

  // Define an internal function '_addWineMerchant' to add this role, called by 'addWineMerchant'
  function _addWineMerchant(address account) internal {
    wineMerchants.add(account);
    emit WineMerchantAdded(account);
  }

  // Define an internal function '_removeWineMerchant' to remove this role, called by 'removeWineMerchant'
  function _removeWineMerchant(address account) internal {
    wineMerchants.remove(account);
    emit WineMerchantRemoved(account);
  }
}