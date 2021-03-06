pragma solidity ^0.5.0;

import "../wineaccesscontrol/ConsumerRole.sol";
import "../wineaccesscontrol/WinemakerRole.sol";
import "../wineaccesscontrol/WineMerchantRole.sol";
import "../winecore/Pausable.sol";
import "../utils/SafeMath.sol";

// Define a contract 'Supplychain'
contract SupplyChain is Pausable, ConsumerRole, WinemakerRole, WineMerchantRole {
  using SafeMath for uint256;

  // Define a variable called 'sku' for Stock Keeping Unit (SKU)
  uint  sku;

  // Define a public mapping 'wines' that maps the UPC to an Wine.
  mapping (uint => Wine) wines;

  // Define a public mapping 'winesHistory' that maps the UPC to an array of TxHash, 
  // that track its journey through the supply chain -- to be sent from DApp.
  mapping (uint => string[]) winesHistory;
  
  // Define enum 'State' with the following values:
  enum State 
  { 
    Made,   // 0
    Aged,   // 1
    Bottled,  // 2
    Packed,   // 3
    ForSale,  // 4
    Sold,    // 5
    Shipped,   // 6
    Received,   // 7
    ForPurchase, // 8
    Purchased,  // 9
    Drunk // 10
  }

  State constant defaultState = State.Made;

  // Define a struct 'Item' with the following fields:
  struct Wine {
    uint    sku;  // Stock Keeping Unit (SKU)
    uint    upc; // Universal Product Code (UPC), generated by the Farmer, goes on the package, can be verified by the Consumer
    uint    monthsAged; // Number of months the wine has been aged
    address ownerID;  // Metamask-Ethereum address of the current owner as the product moves through 8 stages
    address payable originWinemakerID; // Metamask-Ethereum address of the Farmer
    string  originWinemakerName; // Winemaker Name
    string  originWinemakerInformation;  // Winemaker Information
    string  originWinemakerLatitude; // Winemaker Latitude
    string  originWinemakerLongitude;  // Winemaker Longitude
    uint    productID;  // Product ID potentially a combination of upc + sku
    string  productNotes; // Product Notes
    uint    productPrice; // Product Price
    uint    productFinalPrice; // Final price pof the product when sales by the wine merchant
    State   wineState;  // Product State as represented in the enum above
    address payable wineMerchantID;  // Metamask-Ethereum address of the Wine Merchant
    address payable consumerID; // Metamask-Ethereum address of the Consumer
  }

  // Define 8 events with the same 11 state values and accept 'upc' as input argument
  event Made(uint upc);
  event Aged(uint upc);
  event Bottled(uint upc);
  event Packed(uint upc);
  event ForSale(uint upc);
  event Sold(uint upc);
  event Shipped(uint upc);
  event Received(uint upc);
  event ForPurchase(uint upc);
  event Purchased(uint upc);
  event Drunk(uint upc);

  // Define a modifer that verifies the Caller
  modifier verifyCaller (address payable _address) {
    require(msg.sender == _address, "SupplyChain::verifyCaller - The caller is not the one supposed"); 
    _;
  }

  // Define a modifier that checks if the paid amount is sufficient to cover the price
  modifier paidEnough(uint _price) { 
    require(msg.value >= _price, "SupplyChain::paidEnough - Not enough fund"); 
    _;
  }
  
  // Define a modifier that checks the price and refunds the remaining balance
  modifier checkValue(uint price) {
    _;
    uint amountToReturn = msg.value.sub(price);
    msg.sender.transfer(amountToReturn);
  }

  // Define a modifier that checks if an wine.state of a upc is Made
  modifier made(uint _upc) {
    require(wines[_upc].wineState == State.Made, "SupplyChain::made - this wine has not the Made state");
    _;
  }

  // Define a modifier that checks if an wine.state of a upc is Aged
  modifier aged(uint _upc) {
    require(wines[_upc].wineState == State.Aged, "SupplyChain::aged - this wine has not the Aged state");
    _;
  }
  
  // Define a modifier that checks if an wine.state of a upc is Bottled
  modifier bottled(uint _upc) {
    require(wines[_upc].wineState == State.Bottled, "SupplyChain::bottled - this wine has not the Bottled state");
    _;
  }

    // Define a modifier that checks if an wine.state of a upc is Packed
  modifier packed(uint _upc) {
    require(wines[_upc].wineState == State.Packed, "SupplyChain::packed - this wine has not the Packed state");
    _;
  }

  // Define a modifier that checks if an wine.state of a upc is ForSale
  modifier forSale(uint _upc) {
    require(wines[_upc].wineState == State.ForSale, "SupplyChain::forSale - this wine has not the ForSale state");
    _;
  }

  // Define a modifier that checks if an wine.state of a upc is Sold
  modifier sold(uint _upc) {
    require(wines[_upc].wineState == State.Sold, "SupplyChain::sold - this wine has not the Sold state");
    _;
  }
  
  // Define a modifier that checks if an wine.state of a upc is Shipped
  modifier shipped(uint _upc) {
    require(wines[_upc].wineState == State.Shipped, "SupplyChain::shipped - this wine has not the Shipped state");
    _;
  }

  // Define a modifier that checks if an wine.state of a upc is Received
  modifier received(uint _upc) {
    require(wines[_upc].wineState == State.Received, "SupplyChain::received - this wine has not the Received state");
    _;
  }

  // Define a modifier that checks if an wine.state of a upc is ForPurchase
  modifier forPurchase(uint _upc) {
    require(wines[_upc].wineState == State.ForPurchase, "SupplyChain::forPurchase - this wine has not the ForPurchase state");
    _;
  }

  // Define a modifier that checks if an wine.state of a upc is Purchased
  modifier purchased(uint _upc) {
    require(wines[_upc].wineState == State.Purchased, "SupplyChain::purchased - this wine has not the Purchased state");
    _;
  }

  // Define a modifier that checks if an wine.state of a upc is Drunk
  modifier drunk(uint _upc) {
    require(wines[_upc].wineState == State.Drunk, "SupplyChain::drunk - this wine has not the Drunk state");
    _;
  }

  constructor() public payable {
    sku = 1;
  }

  // Define a function 'kill' if required
  function kill() public onlyOwner {
    selfdestruct(address(uint160(owner())));
  }

  // Define a function 'makeItem' that allows a farmer to mark an item 'Made'
  function makeWine(uint _upc, string memory _originWinemakerName, string memory _originWinemakerInformation, string  memory _originWinemakerLatitude, string  memory _origineWinemakerLongitude, string  memory _productNotes) public onlyWinemaker whenNotPaused {
    // Add the new item as part of Harvest
    wines[_upc] = Wine({
      sku: sku,
      upc: _upc,
      monthsAged: 0,
      ownerID: msg.sender,
      originWinemakerID: msg.sender,
      originWinemakerName: _originWinemakerName,
      originWinemakerInformation: _originWinemakerInformation,
      originWinemakerLatitude: _originWinemakerLatitude,
      originWinemakerLongitude: _origineWinemakerLongitude,
      productID: sku.add(_upc),
      productNotes: _productNotes,
      productPrice: 0,
      productFinalPrice: 0,
      wineState: State.Made,
      wineMerchantID: address(0),
      consumerID: address(0)
    });
    
    // Increment sku
    sku = sku.add(1);

    // Emit the Made event
    emit Made(_upc);
    
  }


  // Define a function 'ageWine' that allows a winemaker to mark a wine 'Aged'
  function ageWine(uint _upc, uint monthsAged) public made(_upc) verifyCaller(wines[_upc].originWinemakerID) {
    // Update the appropriate fields
    wines[_upc].monthsAged = monthsAged;
    wines[_upc].wineState = State.Aged;
    
    // Emit the Aged event
    emit Aged(_upc);
    
  }
  

  // Define a function 'bottleWine' that allows a winemaker to mark a wine 'Bottled'
  function bottleWine(uint _upc) public aged(_upc) verifyCaller(wines[_upc].originWinemakerID) {
    // Update the appropriate fields
    wines[_upc].wineState = State.Bottled;
    
    // Emit the Bottle event
    emit Bottled(_upc);
    
  }

  // Define a function 'packWine' that allows a farmer to mark an item 'Packed'
  function packWine(uint _upc) public bottled(_upc) verifyCaller(wines[_upc].originWinemakerID) {
    // Update the appropriate fields
    wines[_upc].wineState = State.Packed;
    
    // Emit the appropriate event
    emit Packed(_upc);
  }


  // Define a function 'sellWine' that allows a farmer to mark an item 'ForSale'
  function sellWine(uint _upc, uint _price) public packed(_upc) verifyCaller(wines[_upc].originWinemakerID) {
    // Update the appropriate fields
    wines[_upc].wineState = State.ForSale;
    wines[_upc].productPrice = _price;
    
    // Emit the appropriate event
    emit ForSale(_upc);
    
  }

  // Define a function 'buyWine' that allows the WineMerchant to mark an item 'Sold'
  function buyWine(uint _upc) public payable forSale(_upc) paidEnough(wines[_upc].productPrice) checkValue(wines[_upc].productPrice) onlyWineMerchant whenNotPaused {
    // Update the appropriate fields - ownerID, wineMerchantID, wineState
    wines[_upc].wineState = State.Sold;
    wines[_upc].wineMerchantID = msg.sender;
    wines[_upc].ownerID = msg.sender;
    
    // Transfer money to winemaker
    wines[_upc].originWinemakerID.transfer(wines[_upc].productPrice)    ;
    // emit the appropriate event
    emit Sold(_upc);
    
  }

  // Define a function 'shipWine' that allows the distributor to mark an item 'Shipped'
  // Use the above modifers to check if the item is sold
  function shipWine(uint _upc) public sold(_upc) verifyCaller(wines[_upc].originWinemakerID) {
    // Update the appropriate fields
    wines[_upc].wineState = State.Shipped;
    
    // Emit the appropriate event
    emit Shipped(_upc);
  }

  // Define a function 'receiveWine' that allows the retailer to mark an item 'Received'
  // Use the above modifiers to check if the item is shipped
  function receiveWine(uint _upc) public shipped(_upc) verifyCaller(wines[_upc].wineMerchantID) {
    wines[_upc].wineState = State.Received;
    
    // Emit the appropriate event
    emit Received(_upc);
  }


  // Define a function 'setOnPurchaseWine' that allows the retailer to mark an item 'ForPurchase'
  // Use the above modifiers to check if the item is shipped
  function setOnPurchaseWine(uint _upc, uint _price) public received(_upc) verifyCaller(wines[_upc].wineMerchantID) {
    wines[_upc].wineState = State.ForPurchase;
    wines[_upc].productFinalPrice = _price;
    
    // Emit the appropriate event
    emit ForPurchase(_upc);
  }

  // Define a function 'purchaseWine' that allows the consumer to mark an item 'Purchased'
  function purchaseWine(uint _upc) public payable forPurchase(_upc) paidEnough(wines[_upc].productFinalPrice) checkValue(wines[_upc].productFinalPrice) onlyConsumer whenNotPaused {
    // Update the appropriate fields - ownerID, consumerID, wineState
    wines[_upc].wineState = State.Purchased;
    wines[_upc].consumerID = msg.sender;
    wines[_upc].ownerID = msg.sender;
    wines[_upc].wineMerchantID.transfer(wines[_upc].productFinalPrice);
    
    // Emit the appropriate event
    emit Purchased(_upc);
  }

  // Define a function 'purchaseWine' that allows the consumer to mark an item 'Purchased'
  function drinkWine(uint _upc) public purchased(_upc) verifyCaller(wines[_upc].consumerID) {
    // Update the appropriate fields - ownerID, consumerID, wineState
    wines[_upc].wineState = State.Drunk;

    // Emit the appropriate event
    emit Drunk(_upc);
  }

  // Define a function 'fetchWineBufferOne' that fetches the data
  function fetchWineBufferOne(uint _upc) public view returns 
  (
    uint    wineSKU,
    uint    wineUPC,
    address ownerID,
    address payable originWinemakerID,
    string  memory originWinemakerName,
    string  memory originWinemakerInformation,
    string  memory originWinemakerLatitude,
    string  memory originWinemakerLongitude
  ) 
  {
    Wine storage wine = wines[_upc];
    wineSKU = wine.sku;
    wineUPC = wine.upc;
    ownerID = wine.ownerID;
    originWinemakerID = wine.originWinemakerID;
    originWinemakerName = wine.originWinemakerName;
    originWinemakerInformation = wine.originWinemakerInformation;
    originWinemakerLatitude = wine.originWinemakerLatitude;
    originWinemakerLongitude = wine.originWinemakerLongitude;
  }

  // Define a function 'fetchWineBufferTwo' that fetches the data
  function fetchWineBufferTwo(uint _upc) public view returns 
  (
    uint    wineSKU,
    uint    wineUPC,
    uint    productID,
    uint    productPrice,
    uint    productFinalPrice,
    uint    monthsAged,
    uint    wineState,
    string  memory productNotes,
    address payable wineMerchantID,
    address payable consumerID
  ) 
  {
    Wine storage wine = wines[_upc];
    wineSKU = wine.sku;
    wineUPC = wine.upc;
    productID = wine.productID;
    productNotes = wine.productNotes;
    productPrice = wine.productPrice;
    productFinalPrice = wine.productFinalPrice;
    monthsAged = wine.monthsAged;
    wineState = uint(wine.wineState);
    wineMerchantID = wine.wineMerchantID;
    consumerID = wine.consumerID;
  }
}
