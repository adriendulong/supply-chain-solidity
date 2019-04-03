pragma solidity ^0.5.0;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'FarmerRole' to manage this role - add, remove, check
contract WinemakerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event WinemakerAdded(address indexed account);
  event WinemakerRemoved(address indexed account);

  // Define a struct 'winemakers' by inheriting from 'Roles' library, struct Role
  Roles.Role private winemakers;

  // In the constructor make the address that deploys this contract the 1st winemaker
  constructor() public {
    _addWinemaker(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyWinemaker() {
    require(isWinemaker(msg.sender), "WinemakerRole::onlyWinemaker - You need the winemaker role to do this action");
    _;
  }

  // Define a function 'isWinemaker' to check this role
  function isWinemaker(address account) public view returns (bool) {
    return winemakers.has(account);
  }

  // Define a function 'addWinemaker' that adds this role
  function addWinemaker(address account) public onlyWinemaker {
    _addWinemaker(account);
  }

  // Define a function 'renounceWinemaker' to renounce this role
  function renounceWinemaker() public {
    _removeWinemaker(msg.sender);
  }

  // Define an internal function '_addWinemaker' to add this role, called by 'addWinemaker'
  function _addWinemaker(address account) internal {
    winemakers.add(account);
    emit WinemakerAdded(account);
  }

  // Define an internal function '_removeWinemaker' to remove this role, called by 'renounceWinemaker'
  function _removeWinemaker(address account) internal {
    winemakers.remove(account);
    emit WinemakerRemoved(account);
  }
}