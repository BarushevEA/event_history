"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryArray = void 0;
class HistoryArray {
    constructor(size) {
        this._maxSize = size;
        this._size = 0;
        this._isDestroyed = false;
    }
    getArr() {
        if (this._isDestroyed)
            return [];
        if (!this._root)
            return [];
        if (this._size === 1 && this._root)
            return [this._root.value];
        const arr = [];
        let node = this._root;
        do {
            arr.push(node.value);
            node = node.child;
        } while (node);
        arr.reverse();
        return arr;
    }
    isIncludes(state) {
        if (this._isDestroyed)
            return false;
        if (!this._root)
            return false;
        let node = this._root;
        do {
            if (node.value === state)
                return true;
            node = node.child;
        } while (node);
        return false;
    }
    push(state) {
        if (this._isDestroyed)
            return undefined;
        const node = {
            child: this._root,
            parent: 0,
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
            const lastNode = this._lastNode;
            this._lastNode = lastNode.parent;
            lastNode.parent = 0;
            this._lastNode && (this._lastNode.child = 0);
        }
        return this._lastNode.value;
    }
    destroy() {
        if (this._isDestroyed)
            return;
        this._isDestroyed = true;
        this._size = 0;
        this._root = undefined;
        this._lastNode = undefined;
    }
    get maxSize() {
        return this._maxSize;
    }
    get size() {
        return this._size;
    }
    get isDestroyed() {
        return this._isDestroyed;
    }
}
exports.HistoryArray = HistoryArray;
