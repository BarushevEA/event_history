import {HistoryNode, IHistoryArr} from "./types";
import {IDestroy} from "evg_observable/src/outLib/Types";

export class HistoryArray<T> implements IHistoryArr<T>, IDestroy {
    private readonly _maxSize: number;
    private _size: number;
    private _root: HistoryNode<T> | undefined;
    private _lastNode: HistoryNode<T> | undefined;
    private _isDestroyed: boolean;

    constructor(size: number) {
        this._maxSize = size;
        this._size = 0;
        this._isDestroyed = false;
    }

    getArr(): T[] {
        if (this._isDestroyed) return [];
        if (!this._root) return [];
        if (this._size === 1 && this._root) return [this._root.value];

        const arr: T[] = [];
        let node: HistoryNode<T> | undefined = this._root;

        do {
            arr.push(node.value);
            node = node.child;
        } while (node)

        arr.reverse();

        return arr;
    }

    isIncludes(state: T): boolean {
        if (this._isDestroyed) return false;
        if (!this._root) return false;

        let node: HistoryNode<T> | undefined = this._root;

        do {
            if (node.value === state) return true;
            node = node.child;
        } while (node)

        return false;
    }

    push(state: T): T | undefined {
        if (this._isDestroyed) return undefined;

        const node: HistoryNode<T> = {
            child: this._root,
            parent: <any>0,
            value: state
        };

        this._size++;

        if (!this._root) {
            this._root = node;
            this._lastNode = node;
            return this._lastNode.value;
        }

        this._root.parent = node;
        this._root = node;

        if (this._size > this._maxSize && this._lastNode) {
            this._size--;
            const lastNode: HistoryNode<T> = this._lastNode;

            this._lastNode = lastNode.parent;
            lastNode.parent = <any>0;
            this._lastNode && (this._lastNode.child = <any>0);
        }

        return (<any>this._lastNode).value;
    }

    destroy(): void {
        if (this._isDestroyed) return;
        this._isDestroyed = true;
        this._size = 0;
        this._root = undefined;
        this._lastNode = undefined;
    }

    get maxSize(): number {
        return this._maxSize;
    }

    get size(): number {
        return this._size;
    }

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }
}
