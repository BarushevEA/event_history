import {IEventHistory} from "./types";
import {Observable} from "evg_observable/src/outLib/Observable";
import {HistoryArray} from "./historyArray";
import {IDestroy, IListener, ISubscriptionLike} from "evg_observable/src/outLib/Types";

export class History<T> implements IEventHistory<T>, IDestroy {
    private _isDestroyed: boolean;
    private _state: T;
    private readonly _defaultSize: number;
    private readonly _history: HistoryArray<T>;
    private _event$: Observable<T>;

    constructor(startState: T, size?: number) {
        this._isDestroyed = false;
        this._event$ = new Observable<T>(startState);
        this._state = startState;
        this._defaultSize = 50;
        const historySize = size && size > 0 ? size : this._defaultSize;
        this._history = new HistoryArray<T>(historySize);
        this.state = startState;
    }

    eventSubscribe$(subscriber: IListener<T>): ISubscriptionLike<T> | undefined {
        if (this._isDestroyed) return undefined;

        return this._event$.subscribe(subscriber);
    }

    getHistory(): T[] {
        return this._history.getArr();
    }

    isHistoryIncludes(state: T): boolean {
        return this._history.isIncludes(state);
    }

    stateForHistory(state: T): void {
        if (this._isDestroyed) return undefined;

        this.addStateToHistory(state);

        this._event$.next(state);
    }

    private addStateToHistory(state: T): void {
        this._history.push(state);
    }

    destroy(): void {
        if (this._isDestroyed) return;

        this._isDestroyed = true;
        this._event$.destroy();
        this._history.destroy();
    }

    get state(): T {
        return this._state;
    }

    set state(state: T) {
        if (this._isDestroyed) return;

        this.addStateToHistory(state);

        this._state = state;

        this._event$.next(state);
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    get maxHistorySize(): number {
        return this._history.maxSize;
    }

    get historySize(): number {
        return this._history.size;
    }
}