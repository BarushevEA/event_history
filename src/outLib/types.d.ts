import { IListener, ISubscriptionLike } from "evg_observable/src/outLib/Types";
export type IEventHistory<T> = {
    state: T;
    maxHistorySize: number;
    historySize: number;
    eventSubscribe$(subscriber: IListener<T>): ISubscriptionLike<T> | undefined;
    stateForHistory(state: T): void;
    isHistoryIncludes(state: T): boolean;
    getHistory(): T[];
};
export type IHistoryArr<T> = {
    maxSize: number;
    size: number;
    push(state: T): T | undefined;
    getArr(): T[];
    isIncludes(state: T): boolean;
};
export type HistoryNode<T> = {
    parent: HistoryNode<T> | undefined;
    child: HistoryNode<T> | undefined;
    value: T;
};
