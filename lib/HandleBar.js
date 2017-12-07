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
var ReactDOM = require("react-dom");
var HandleBar = /** @class */ (function (_super) {
    __extends(HandleBar, _super);
    function HandleBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getDivInstance = function () {
            return ReactDOM.findDOMNode(_this.div);
        };
        return _this;
    }
    HandleBar.prototype.render = function () {
        var _this = this;
        var _a = this.props, position = _a.position, handleMouseDown = _a.handleMouseDown, allowResize = _a.allowResize;
        var classNames = [
            'handle-bar',
            position,
            !allowResize && 'resize-not-allowed',
        ].filter(function (cls) { return cls; }).join(' ');
        return (React.createElement("div", { className: classNames, ref: function (node) { return _this.div = node; }, onMouseDown: function (e) { return handleMouseDown(e); }, onTouchStart: function (e) { return handleMouseDown(e); } },
            React.createElement("span", { className: "handle-bar_drag" })));
    };
    HandleBar.defaultProps = {
        allowResize: true
    };
    return HandleBar;
}(React.Component));
exports.default = HandleBar;
