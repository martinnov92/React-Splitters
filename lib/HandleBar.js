"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var HandleBar = (function (_super) {
    __extends(HandleBar, _super);
    function HandleBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HandleBar.prototype.render = function () {
        var _a = this.props, position = _a.position, handleMouseDown = _a.handleMouseDown, allowResize = _a.allowResize;
        var allowResizeClass = allowResize ? '' : 'resize-not-allowed';
        return (React.createElement("div", { className: "handle-bar " + position + " " + allowResizeClass, onMouseDown: function (e) { return handleMouseDown(e); }, onTouchStart: function (e) { return handleMouseDown(e); } },
            React.createElement("span", { className: "handle-bar_drag" })));
    };
    ;
    return HandleBar;
}(React.Component));
HandleBar.defaultProps = {
    allowResize: true
};
exports.default = HandleBar;
