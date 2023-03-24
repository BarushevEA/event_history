import {suite, test} from '@testdeck/mocha';
import * as _chai from 'chai';
import {expect} from 'chai';
import {Event$} from "../src/Libraries/env";
import {HistoryArray} from "../src/Libraries/historyArray";


_chai.should();
_chai.expect;

@suite
class HistoryArrayUnitTest {
    private ARR: HistoryArray<Event$>;

    before() {
        this.ARR = new HistoryArray<Event$>(5);
    }

    @test 'Array is created'() {
        expect(false).to.be.eql(this.ARR.isDestroyed);
        expect(5).to.be.eql(this.ARR.maxSize);
        expect(0).to.be.eql(this.ARR.size);
    }

    @test 'Array push 1 element'() {
        const last = this.ARR.push(Event$.UNDEFINED);

        expect(Event$.UNDEFINED).to.be.eql(last);
        expect(false).to.be.eql(this.ARR.isDestroyed);
        expect(5).to.be.eql(this.ARR.maxSize);
        expect(1).to.be.eql(this.ARR.size);
    }

    @test 'Array push 3 elements'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.START);

        expect(Event$.UNDEFINED).to.be.eql(last);
        expect(false).to.be.eql(this.ARR.isDestroyed);
        expect(5).to.be.eql(this.ARR.maxSize);
        expect(3).to.be.eql(this.ARR.size);
    }

    @test 'Array push 5 elements'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.READY);
        last = this.ARR.push(Event$.STOP);

        expect(Event$.UNDEFINED).to.be.eql(last);
        expect(false).to.be.eql(this.ARR.isDestroyed);
        expect(5).to.be.eql(this.ARR.maxSize);
        expect(5).to.be.eql(this.ARR.size);
    }

    @test 'Array push 6 elements'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.READY);
        last = this.ARR.push(Event$.STOP);
        last = this.ARR.push(Event$.DETECT);

        expect(Event$.INIT).to.be.eql(last);
        expect(false).to.be.eql(this.ARR.isDestroyed);
        expect(5).to.be.eql(this.ARR.maxSize);
        expect(5).to.be.eql(this.ARR.size);
        expect([
            Event$.INIT,
            Event$.START,
            Event$.READY,
            Event$.STOP,
            Event$.DETECT,
        ]).to.be.eql(this.ARR.getArr());
    }

    @test 'Array push 1 element and check isIncludes'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);

        expect(Event$.UNDEFINED).to.be.eql(last);
        expect(false).to.be.eql(this.ARR.isDestroyed);
        expect(5).to.be.eql(this.ARR.maxSize);
        expect(1).to.be.eql(this.ARR.size);
        expect(true).to.be.eql(this.ARR.isIncludes(Event$.UNDEFINED));
    }

    @test 'Array push 2 element and check isIncludes'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);
        last = this.ARR.push(Event$.INIT);

        expect(true).to.be.eql(this.ARR.isIncludes(Event$.UNDEFINED));
    }

    @test 'Array push 5 element and check isIncludes'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.INIT);

        expect(true).to.be.eql(this.ARR.isIncludes(Event$.UNDEFINED));
    }

    @test 'Array push 6 element and check isIncludes'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);

        expect(false).to.be.eql(this.ARR.isIncludes(Event$.UNDEFINED));
        expect(Event$.INIT).to.be.eql(last);
    }

    @test 'Array destroy'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);

        this.ARR.destroy();

        expect(0).to.be.eql(this.ARR.size);
        expect(true).to.be.eql(this.ARR.isDestroyed);
    }

    @test 'Array destroy and getArr()'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);

        this.ARR.destroy();

        expect(0).to.be.eql(this.ARR.size);
        expect(true).to.be.eql(this.ARR.isDestroyed);
        expect([]).to.be.eql(this.ARR.getArr());
    }

    @test 'Array getArr() before using'() {
        expect(0).to.be.eql(this.ARR.size);
        expect(false).to.be.eql(this.ARR.isDestroyed);
        expect([]).to.be.eql(this.ARR.getArr());
    }

    @test 'Array getArr() by 1 using'() {
        this.ARR.push(Event$.UNDEFINED);
        expect(1).to.be.eql(this.ARR.size);
        expect(false).to.be.eql(this.ARR.isDestroyed);
        expect([Event$.UNDEFINED]).to.be.eql(this.ARR.getArr());
    }

    @test 'Array getArr() by 2 using'() {
        this.ARR.push(Event$.UNDEFINED);
        this.ARR.push(Event$.INIT);
        expect(2).to.be.eql(this.ARR.size);
        expect(false).to.be.eql(this.ARR.isDestroyed);
        expect([
            Event$.UNDEFINED,
            Event$.INIT
        ]).to.be.eql(this.ARR.getArr());
    }

    @test 'Array destroy and isIncludes(state: T)'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);

        this.ARR.destroy();

        expect(0).to.be.eql(this.ARR.size);
        expect(true).to.be.eql(this.ARR.isDestroyed);
        expect(false).to.be.eql(this.ARR.isIncludes(Event$.START));
    }

    @test 'Array destroy and isIncludes(state: T) before using'() {
        expect(0).to.be.eql(this.ARR.size);
        expect(false).to.be.eql(this.ARR.isDestroyed);
        expect(false).to.be.eql(this.ARR.isIncludes(Event$.START));
    }

    @test 'Array destroy and push(state: T)'() {
        let last: Event$;
        last = this.ARR.push(Event$.UNDEFINED);
        last = this.ARR.push(Event$.INIT);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);
        last = this.ARR.push(Event$.START);

        this.ARR.destroy();

        last = this.ARR.push(Event$.START);

        expect(0).to.be.eql(this.ARR.size);
        expect(true).to.be.eql(this.ARR.isDestroyed);
        expect(undefined).to.be.eql(last);
    }

    @test 'Array destroy && destroy()'() {
        this.ARR.destroy();
        this.ARR.destroy();

        expect(0).to.be.eql(this.ARR.size);
        expect(true).to.be.eql(this.ARR.isDestroyed);
    }
}