import { IEventHistory } from "./types";
import { IDestroy, IListener, ISubscriptionLike } from "evg_observable/src/outLib/Types";
export declare class History<T> implements IEventHistory<T>, IDestroy {
    private _isDestroyed;
    private _state;
    private readonly _defaultSize;
    private readonly _history;
    private _event$;
    constructor(startState: T, size?: number);
    eventSubscribe$(subscriber: IListener<T>): ISubscriptionLike<T> | undefined;
    getHistory(): T[];
    isHistoryIncludes(state: T): boolean;
    stateForHistory(state: T): void;
    private addStateToHistory;
    destroy(): void;
    get state(): T;
    set state(state: T);
    get isDestroyed(): boolean;
    get maxHistorySize(): number;
    get historySize(): number;
}
