"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
const Observable_1 = require("evg_observable/src/outLib/Observable");
const historyArray_1 = require("./historyArray");
class History {
    constructor(startState, size) {
        this._isDestroyed = false;
        this._event$ = new Observable_1.Observable(startState);
        this._state = startState;
        this._defaultSize = 50;
        const historySize = size && size > 0 ? size : this._defaultSize;
        this._history = new historyArray_1.HistoryArray(historySize);
        this.state = startState;
    }
    eventSubscribe$(subscriber) {
        if (this._isDestroyed)
            return undefined;
        return this._event$.subscribe(subscriber);
    }
    getHistory() {
        return this._history.getArr();
    }
    isHistoryIncludes(state) {
        return this._history.isIncludes(state);
    }
    stateForHistory(state) {
        if (this._isDestroyed)
            return undefined;
        this.addStateToHistory(state);
        this._event$.next(state);
    }
    addStateToHistory(state) {
        this._history.push(state);
    }
    destroy() {
        if (this._isDestroyed)
            return;
        this._isDestroyed = true;
        this._event$.destroy();
        this._history.destroy();
    }
    get state() {
        return this._state;
    }
    set state(state) {
        if (this._isDestroyed)
            return;
        this.addStateToHistory(state);
        this._state = state;
        this._event$.next(state);
    }
    get isDestroyed() {
        return this._isDestroyed;
    }
    get maxHistorySize() {
        return this._history.maxSize;
    }
    get historySize() {
        return this._history.size;
    }
}
exports.History = History;
