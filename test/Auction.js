const BigNumber = require('bignumber.js');
const { assert } = require('chai');
const chai = require('chai');
/* eslint-disable no-undef */
const Auction = artifacts.require('./Auction.sol');

const { advanceTimeAndBlock, itShouldThrow } = require('./utils');

// use default BigNumber
chai.use(require('chai-bignumber')()).should();

// TEST
contract('Auction', (accounts) => {
  let auction;

  const owner = accounts[0];
  const user = accounts[1];
  const user2 = accounts[2];
  before(async () => {
    auction = await Auction.deployed();
  });

  describe('Auction', () => {
    it('bid', async () => {
      const bid = '0.1';
      // bid
      await auction.bid({
        from: user,
        value: web3.utils.toWei(bid),
      });
      const highestOffer = await auction.highestOffer();
      assert.equal(highestOffer.account, user);
      assert.equal(highestOffer.amount, web3.utils.toWei(bid));
    });
  });
});
