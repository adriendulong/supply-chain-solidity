# Supply Chain Smart Contracts

This project implements smart contracts that simulate a wine supply chain.
This project is part of the Udacity Blockchain Nanodegree.

## UML Diagrams

Here are the diagrams that has been done to show the architecture of the project.
As you can see the supply chain flow has been simplified a lot. The idea wan not to match with an exact supplu chain situation
but to have an interesting use of solidity and smart contracts.

**Activity UML Diagram**

![Activity UML Diagram](images/activity_uml_diagram.png)

**Sequence UML Diagram**

![Sequence UML Diagram](images/sequence_uml_diagram.png)

**State UML Diagram**

![State UML Diagram](images/state_uml_diagram.png)

**Class UML Diagram**

![Class UML Diagram](images/class_uml_diagram.png)


## Libraries

**Roles from OpenZeppelin**: Roles library is used in order to manage the different access and authorization for different users. I used the [OpenZeppelin implementation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/access/Roles.sol)

**Pausable contract from OpenZeppelin**: This contract is used in order to be able to Pause a contract. I used the [OpenZeppelin implementation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/lifecycle/Pausable.sol)

**Ownable contract from OpenZeppelin**: This contract is used in order to assign an owner to the contract and being able to transfer the ownership. I used the [OpenZeppelin implementation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol)

**SafeMath from OpenZeppelin**:  I use this library in order to avoid overflow or underflow of uint. [OpenZeppelin SafeMath implementation](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol)


## IPFS