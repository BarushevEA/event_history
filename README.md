<h1 align=center style="color: saddlebrown">
EVG Event history
</h1>
<p align=center>
EVG Observable - is a light library for simple use.
</p>

## What is EVG Event history?

EVG Event history - is a small library for control the events of the object under study.

## Installation

### Node.js

`EVG Event history` is available on [npm](http://npmjs.org). To install it, type:

    $ npm install evg_event_history

# Usage

## Event history simple usage

I propose to consider an example of using the library.
The written code is just an attempt to show how the library works.
I apologize in advance for some logical and stylistic errors.

The example describes how a user receives money from an ATM.
Everything is simplified as much as possible.

## Create Environment Variables

_file: env.ts_

```ts
export enum Evt {
    INIT = "INIT",
    READY = "READY",
    ALLOWED = "ALLOWED",
    DISALLOWED = "DISALLOWED",
    REQUEST_FOR_MONEY = "REQUEST_FOR_MONEY",
    GET_MONEY = "GET_MONEY",
    LIMIT_ERROR = "LIMIT_ERROR",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export type CreditCard = {
    creditLimit: number;
}

export type Cash = {
    coins: number;
    description: string;
}
```

## Create cash machine

_file: cashMachine.ts_

```ts
import {History} from "evg_event_history/src/outLib/history";
import {Cash, CreditCard, Evt} from "./env";

export class CashMachine extends History<Evt> {
    userCard: CreditCard;

    constructor() {
        super(Evt.INIT);
        this.state = Evt.READY;
    }

    getMoney(card: CreditCard): Cash {
        this.userCard = card;
        this.state = Evt.REQUEST_FOR_MONEY;

        return this.handleBankReaction();
    }

    private handleBankReaction(): Cash {
        switch (this.state) {
            case Evt.ALLOWED:
                const userCash = this.userCard.creditLimit;
                this.state = Evt.GET_MONEY;

                return {
                    coins: userCash,
                    description: "Here is your money",
                };
            case Evt.DISALLOWED:
                this.state = Evt.LIMIT_ERROR;

                return {
                    coins: 0,
                    description: "Credit limit exceeded",
                };
        }

        this.state = Evt.UNKNOWN_ERROR;
        return {
            coins: 0,
            description: "Unknown error",
        }
    }

    allowOperation(): void {
        this.state = Evt.ALLOWED;
    }

    disallowOperation(): void {
        this.state = Evt.DISALLOWED;
    }
}
```

## Create bank

_file: bank.ts_

```ts
import {ISubscriptionLike} from "evg_observable/src/outLib/Types";
import {Evt} from "./env";
import {CashMachine} from "./cashMachine";

export class Bank {
    subscriber: ISubscriptionLike<Evt>;

    connectTo(cashMachine: CashMachine): void {
        this.subscriber = cashMachine.eventSubscribe$(evt => {
            switch (evt) {
                case Evt.REQUEST_FOR_MONEY:
                    if (cashMachine.userCard.creditLimit > 0) {
                        cashMachine.allowOperation();
                        break;
                    }
                    cashMachine.disallowOperation();
                    break;
                case Evt.GET_MONEY:
                    cashMachine.userCard.creditLimit = 0;
            }
        })
    }

    communicationBreak(): void {
        this.subscriber && this.subscriber.unsubscribe();
        this.subscriber = null;
    }
}
```

## Collect and launch
_file: index.ts_
```ts
import {CashMachine} from "./cashMachine";
import {Bank} from "./bank";

const userCard = {creditLimit: 100}; // The user has a card with a limit of 100 coins
const bank = new Bank(); // The bank services cards
const cashMachine = new CashMachine(); // User wants to withdraw cash from this ATM

bank.connectTo(cashMachine); // ATM connected to the bank

console.log(
    "The user is trying to get money (there are 100 coins in the card):",
    cashMachine.getMoney(userCard)); // The user received his money

console.log(
    "The user is trying to get money (but he got everything last time):",
    cashMachine.getMoney(userCard)); // Alas, the money is no longer on the card

bank.communicationBreak(); // Something happened and the ATM lost connection

console.log(
    "The user is trying to get money again (but the connection failed):",
    cashMachine.getMoney(userCard)); // Sorry something is wrong

console.log(
    "Cash machine events history:",
    cashMachine.getHistory()); // The support team checked the history of ATM events

/**
Print to console:

The user is trying to get money (there are 100 coins in the card): { coins: 100, description: 'Here is your money' }
The user is trying to get money (but he got everything last time): { coins: 0, description: 'Credit limit exceeded' }
The user is trying to get money (but the connection failed): { coins: 0, description: 'Unknown error' }
Cash machine events history: [
  'INIT',
  'READY',
  'REQUEST_FOR_MONEY',
  'ALLOWED',
  'GET_MONEY',
  'REQUEST_FOR_MONEY',
  'DISALLOWED',
  'LIMIT_ERROR',
  'REQUEST_FOR_MONEY',
  'UNKNOWN_ERROR'
]
 */
```