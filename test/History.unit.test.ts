import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {History} from "../src/Libraries/history";
import {Event$} from "../src/Libraries/env";


_chai.should();
_chai.expect;

@suite
class HistoryUnitTest {
    private HISTORY: History<Event$>;

    before() {
        this.HISTORY = new History<Event$>(Event$.UNDEFINED);
    }

    @test 'history is created'() {
        expect(this.HISTORY.isDestroyed).to.be.eql(false);
        expect(this.HISTORY.state).to.be.eql(Event$.UNDEFINED);
        expect(this.HISTORY.getHistory().length).to.be.eql(1);
    }

    @test 'history one state change'() {
        const subscriber = this.HISTORY.eventSubscribe$((state: Event$) => {
            expect(Event$.INIT).to.be.eql(state);
        });

        this.HISTORY.state = Event$.INIT;
        subscriber.unsubscribe();

        expect(this.HISTORY.getHistory().length).to.be.eql(2);
    }

    @test 'history one state change and unsubscribe'() {
        const subscriber = this.HISTORY.eventSubscribe$((state: Event$) => {
            expect(Event$.INIT).to.be.eql(state);
        });

        this.HISTORY.state = Event$.INIT;
        subscriber.unsubscribe();
        this.HISTORY.state = Event$.START;

        expect(this.HISTORY.getHistory().length).to.be.eql(3);
    }

    @test 'history array by 4 states'() {
        this.HISTORY.state = Event$.INIT;
        this.HISTORY.state = Event$.START;
        this.HISTORY.state = Event$.READY;

        expect(this.HISTORY.getHistory().length).to.be.eql(4);
        expect(this.HISTORY.getHistory()).to.be.eql([
            Event$.UNDEFINED,
            Event$.INIT,
            Event$.START,
            Event$.READY,
        ]);
    }

    @test 'history 5 states'() {
        expect(this.HISTORY.state).to.be.eql(Event$.UNDEFINED);
        this.HISTORY.state = Event$.INIT;
        expect(this.HISTORY.state).to.be.eql(Event$.INIT);
        this.HISTORY.state = Event$.START;
        expect(this.HISTORY.state).to.be.eql(Event$.START);
        this.HISTORY.state = Event$.READY;
        expect(this.HISTORY.state).to.be.eql(Event$.READY);
        this.HISTORY.state = Event$.STOP;
        expect(this.HISTORY.state).to.be.eql(Event$.STOP);
        expect(this.HISTORY.getHistory().length).to.be.eql(5);
    }

    @test 'history 5 states with subscriber'() {
        let counter = 0;
        const subscriber = this.HISTORY.eventSubscribe$((state: Event$) => {
            counter++;
            switch (counter) {
                case 1:
                    expect(Event$.INIT).to.be.eql(state);
                    break;
                case 2:
                    expect(Event$.START).to.be.eql(state);
                    break;
                case 3:
                    expect(Event$.READY).to.be.eql(state);
                    break;
                case 4:
                    expect(Event$.STOP).to.be.eql(state);
                    break;
            }
        });

        this.HISTORY.state = Event$.INIT;
        this.HISTORY.state = Event$.START;
        this.HISTORY.state = Event$.READY;
        this.HISTORY.state = Event$.STOP;

        expect(this.HISTORY.getHistory().length).to.be.eql(5);

        subscriber.unsubscribe();
    }

    @test 'history 5 states with subscriber'() {
        this.HISTORY.state = Event$.INIT;
        this.HISTORY.state = Event$.START;
        this.HISTORY.state = Event$.READY;
        this.HISTORY.state = Event$.STOP;

        expect(this.HISTORY.isHistoryIncludes(Event$.READY)).to.be.eql(true);
        expect(this.HISTORY.isHistoryIncludes(Event$.UNDEFINED)).to.be.eql(true);
        expect(this.HISTORY.isHistoryIncludes(Event$.STOP)).to.be.eql(true);
        expect(this.HISTORY.isHistoryIncludes(Event$.READY)).to.be.eql(true);
        expect(this.HISTORY.isHistoryIncludes(Event$.INIT)).to.be.eql(true);
        expect(this.HISTORY.isHistoryIncludes(Event$.SET)).to.be.eql(false);
    }

    @test 'history stateForHistory 1 element'() {
        const subscriber = this.HISTORY.eventSubscribe$((state: Event$) => {
            expect(Event$.BEFORE_ADD).to.be.eql(state);
        });

        this.HISTORY.stateForHistory(Event$.BEFORE_ADD);

        expect(this.HISTORY.state).to.be.eql(Event$.UNDEFINED);
        expect(this.HISTORY.getHistory().length).to.be.eql(2);
        expect(this.HISTORY.getHistory()).to.be.eql([
            Event$.UNDEFINED,
            Event$.BEFORE_ADD
        ]);

        subscriber.unsubscribe();
    }

    @test 'history with 5 size (5 elements + 1 extra)'() {
        const history = new History<Event$>(Event$.UNDEFINED, 5);
        history.state = Event$.INIT;
        history.state = Event$.START;
        history.state = Event$.READY;
        history.state = Event$.STOP;
        history.state = Event$.DESTROY;

        expect([
            Event$.INIT,
            Event$.START,
            Event$.READY,
            Event$.STOP,
            Event$.DESTROY
        ]).to.be.eql(history.getHistory());
        expect(false).to.be.eql(history.isHistoryIncludes(Event$.UNDEFINED));
    }

    @test 'history with 5 size (5 elements + 5 extra)'() {
        const history = new History<Event$>(Event$.UNDEFINED, 5);
        history.state = Event$.ADD;
        history.state = Event$.ADD;
        history.state = Event$.ADD;
        history.state = Event$.ADD;
        history.state = Event$.ADD;

        history.state = Event$.INIT;
        history.state = Event$.START;
        history.state = Event$.READY;
        history.state = Event$.STOP;
        history.state = Event$.DESTROY;

        expect([
            Event$.INIT,
            Event$.START,
            Event$.READY,
            Event$.STOP,
            Event$.DESTROY
        ]).to.be.eql(history.getHistory());
        expect(false).to.be.eql(history.isHistoryIncludes(Event$.UNDEFINED));
    }

    @test 'history destroy'() {
        const history = new History<Event$>(Event$.UNDEFINED, 5);
        history.state = Event$.INIT;
        history.state = Event$.START;
        history.state = Event$.READY;
        history.state = Event$.STOP;
        history.state = Event$.DESTROY;
        history.state = Event$.DESTROY;
        history.state = Event$.DESTROY;
        history.state = Event$.DESTROY;

        expect(history.historySize).to.be.eql(history.maxHistorySize);
        history.destroy();
        expect(true).to.be.eql(history.isDestroyed);
    }

    @test 'history destroy and try to subscribe'() {
        this.HISTORY.state = Event$.INIT;
        this.HISTORY.state = Event$.START;
        this.HISTORY.state = Event$.READY;
        this.HISTORY.state = Event$.STOP;

        this.HISTORY.destroy();

        const subscription = this.HISTORY.eventSubscribe$((state) => {
        })
        expect(undefined).to.be.eql(subscription);
    }

    @test 'history destroy and stateForHistory(state: T)'() {
        let counter = 0;
        this.HISTORY.eventSubscribe$(state => {
            counter++;
        })

        this.HISTORY.destroy();

        this.HISTORY.stateForHistory(Event$.BEFORE_DETECT);
        expect(0).to.be.eql(counter);
        expect(true).to.be.eql(this.HISTORY.isDestroyed);
    }

    @test 'history destroy and this.HISTORY.state'() {
        let counter = 0;
        this.HISTORY.eventSubscribe$(state => {
            counter++;
        })

        this.HISTORY.destroy();

        this.HISTORY.state = Event$.BEFORE_DETECT;
        expect(0).to.be.eql(counter);
        expect(true).to.be.eql(this.HISTORY.isDestroyed);
    }

    @test 'history destroy and this.HISTORY.destroy()'() {
        let counter = 0;
        this.HISTORY.eventSubscribe$(state => {
            counter++;
        })

        this.HISTORY.destroy();

        this.HISTORY.state = Event$.BEFORE_DETECT;
        expect(0).to.be.eql(counter);
        expect(true).to.be.eql(this.HISTORY.isDestroyed);

        this.HISTORY.destroy();

        expect(0).to.be.eql(this.HISTORY.historySize);
    }
}