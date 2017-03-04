"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unselectAll() {
    try {
        window.getSelection().removeAllRanges();
    }
    catch (e) {
        console.warn(e);
    }
}
exports.unselectAll = unselectAll;
