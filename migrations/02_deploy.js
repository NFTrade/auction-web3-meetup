const Auction = artifacts.require('Auction');

const deploy = async (deployer, network, accounts) => {
  await deployer.deploy(Auction, Math.floor(new Date() / 1000));
};

module.exports = deploy;
