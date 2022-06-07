import { Address } from '@graphprotocol/graph-ts';
import { BidPlaced } from '../generated/Auction/Auction';
import { Account, Bid } from '../generated/schema';

export function fetchAccount(address: Address): Account {
	let account = Account.load(address.toHexString());
	if (account == null) {
		account = new Account(address.toHexString());
		account.save();
	}
	return account as Account;
}

export function handleBidPlaced(event: BidPlaced): void {
	let account = fetchAccount(event.params.account);
	let bid = new Bid(account.id.concat('-').concat(event.block.timestamp.toString()))
	bid.account = account.id;
	bid.amount = event.params.amount;
	bid.time = event.params.time;
	bid.save();
}
