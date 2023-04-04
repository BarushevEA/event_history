import { IHistoryArr } from "./types";
import { IDestroy } from "evg_observable/src/outLib/Types";
export declare class HistoryArray<T> implements IHistoryArr<T>, IDestroy {
    private readonly _maxSize;
    private _size;
    private _root;
    private _lastNode;
    private _isDestroyed;
    constructor(size: number);
    getArr(): T[];
    isIncludes(state: T): boolean;
    push(state: T): T | undefined;
    destroy(): void;
    get maxSize(): number;
    get size(): number;
    get isDestroyed(): boolean;
}
