/* eslint-disable no-restricted-syntax */
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
    itShouldThrow('bid too low', async () => {
      const bid = '0.1';
      // bid
      await auction.bid({
        from: user,
        value: web3.utils.toWei(bid),
      });
    }, 'Bid must be higher than min price');
    it('bid many', async () => {
      let bid = await auction.highestBidAmount();
      const minBid = await auction.minBid();
      if (minBid > bid) {
        bid = minBid;
      }
      for await (const usr of accounts) {
        // bid
        bid = BigNumber(bid).plus(1);
        await auction.bid({
          from: usr,
          value: bid,
        });

        const highestOffer = await auction.highestOffer();
        assert.equal(highestOffer.account, usr);
        assert.equal(highestOffer.amount, bid.toString());
      }
    });
    /* itShouldThrow('bid when sale time is over(12 hours)', async () => {
      await advanceTimeAndBlock(50400); // 14 hours
      // bid
      await auction.bid({
        from: user,
        value: web3.utils.toWei('2'),
      });
    }, 'Sale is not live'); */
  });
});
