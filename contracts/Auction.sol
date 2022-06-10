// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Auction is Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    bool public isOpen = true;

    uint256 public minBid = 1 ether;

    uint256 public highestBidAmount;
    address public highestBidAccount;

    uint256 public startTime;
    uint256 public totalTime = 12 hours;

    event BidPlaced(address indexed account, uint256 amount, uint256 time);

    constructor(uint256 _startTime) {
        startTime = _startTime;
    }

    modifier contractIsOpen() {
        require(isOpen, "Contract is closed");
        _;
    }

    /// @dev Check if caller is a wallet
    modifier isEOA() {
        /* require(!(Address.isContract(msg.sender)) && tx.origin == _msgSender(), "Only EOA"); */
        require(!(Address.isContract(msg.sender)), "No Contracts");
        _;
    }

    /// @dev toggle contract validity
    function toggleIsOpen() external onlyOwner {
        isOpen = !isOpen;
    }

    /// @dev withdraw ether from contract
    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    /// @dev get the status of the auction
    /// @return active auction is live
    function isLive()
        public
        view
        returns(bool active)
    {
        return block.timestamp >= startTime && block.timestamp <= startTime.add(totalTime);
    }

    /// @dev get the highest bidder
    /// @return amount
    /// @return account
    function highestOffer()
        external
        view
        returns(uint256 amount, address account)
    {
        return (highestBidAmount, highestBidAccount);
    }

    /// @dev place new bid
    function bid()
        external
        payable
        isEOA
        nonReentrant
        contractIsOpen
    {
        require(isLive(), "Sale is not live");
        require(msg.value >= minBid, "Bid must be higher than min price");
        require(msg.value > highestBidAmount, "Bid must be higher than current highest offer");
        require(msg.sender != highestBidAccount, "Your are already the highest bidder");
        // current highest bid
        uint256 currentHighestBidAmount = highestBidAmount;
        address currentHighestBidAccount = highestBidAccount;
        // update highest bid info
        highestBidAmount = msg.value;
        highestBidAccount = msg.sender;
        // returns previous bidder money
        if (currentHighestBidAccount != address(0)) {
            payable(currentHighestBidAccount).transfer(currentHighestBidAmount);
        }
        emit BidPlaced(msg.sender, msg.value, block.timestamp);
    }
    
}
