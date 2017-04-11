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
/********************************
* import files needed for splitter to work
********************************/
var Pane_1 = require("./Pane");
var HandleBar_1 = require("./HandleBar");
var Helpers_1 = require("./Helpers");
require("./splitters.css");
// TODO: 
// * uložit stav splitteru do localStorage,nebo někam jinam, bude na to callback funkce
var Splitter = (function (_super) {
    __extends(Splitter, _super);
    function Splitter() {
        var _this = _super.call(this) || this;
        _this.handleMouseDown = _this.handleMouseDown.bind(_this);
        _this.handleMouseUp = _this.handleMouseUp.bind(_this);
        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
        _this.getSize = _this.getSize.bind(_this);
        _this.state = {
            isDragging: false
        };
        return _this;
    }
    Splitter.prototype.getSize = function (cX, cY) {
        /********************************
        * This function calculates the max position of a mouse in the current splitter from given percentage.
        /********************************/
        var maxMousePosition;
        var nodeWrapperSize;
        var primaryPaneOffset;
        var wrapper = ReactDOM.findDOMNode(this.paneWrapper).getBoundingClientRect();
        var primaryPane = ReactDOM.findDOMNode(this.panePrimary).getBoundingClientRect();
        var handleBarSize = ReactDOM.findDOMNode(this.handlebar).getBoundingClientRect();
        var posInHandleBar = this.props.position === 'vertical'
            ? handleBarSize.left - cX
            : handleBarSize.top - cY;
        // find only letters from string
        var regEx = new RegExp(/\D+/gi);
        if (this.props.position === 'vertical') {
            // split the maxWidth/maxHeight string to string and numbers
            var maxWidthStr = this.props.primaryPaneMaxWidth.match(regEx)[0].toLowerCase();
            var maxWidthNum = parseFloat(this.props.primaryPaneMaxWidth.split(regEx)[0]);
            nodeWrapperSize = wrapper.width;
            primaryPaneOffset = primaryPane.left;
            if (maxWidthStr === '%') {
                maxMousePosition =
                    Math.floor((nodeWrapperSize * (maxWidthNum / 100)) + primaryPaneOffset - (handleBarSize.width + posInHandleBar));
            }
            else if (maxWidthStr === 'px') {
                maxMousePosition =
                    Math.floor((maxWidthNum + primaryPaneOffset) - handleBarSize.width);
            }
        }
        else {
            var maxHeightStr = this.props.primaryPaneMaxHeight.match(regEx)[0].toLowerCase();
            var maxHeightNum = parseFloat(this.props.primaryPaneMaxHeight.split(regEx)[0]);
            nodeWrapperSize = wrapper.height;
            primaryPaneOffset = primaryPane.top;
            if (maxHeightStr === '%') {
                maxMousePosition =
                    Math.floor((nodeWrapperSize * (maxHeightNum / 100)) + primaryPaneOffset - (handleBarSize.height + posInHandleBar));
            }
            else if (maxHeightStr === 'px') {
                maxMousePosition =
                    Math.floor((maxHeightNum + primaryPaneOffset) - handleBarSize.height);
            }
        }
        this.setState({
            maxMousePosition: maxMousePosition
        });
    };
    Splitter.prototype.componentDidMount = function () {
        /********************************
        * Sets event listeners after component is mounted.
        * If there is only one pane, the resize event listener won't be added
        ********************************/
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('touchend', this.handleMouseUp);
        if (React.Children.count(this.props.children) > 1) {
            window.addEventListener('resize', this.getSize);
        }
    };
    Splitter.prototype.handleMouseDown = function (e) {
        /********************************
        * If the right button was clicked - stop the function
        * If there is more then one pane, we get the sizes of panes + max pos of mouse in splitter
        * add event listener for touch move and mouse move
        ********************************/
        if (e.button === 2 || this.props.allowResize === false) {
            return;
        }
        var handleBarOffsetFromParent;
        var clientX;
        var clientY;
        if (e.type === 'mousedown') {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        else if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        if (React.Children.count(this.props.children) > 1) {
            this.getSize(clientX, clientY);
        }
        if (this.props.position === 'horizontal') {
            handleBarOffsetFromParent = clientY - e.target.offsetTop;
        }
        else if (this.props.position === 'vertical') {
            handleBarOffsetFromParent = clientX - e.target.offsetLeft;
        }
        this.setState({
            isDragging: true,
            handleBarOffsetFromParent: handleBarOffsetFromParent
        });
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('touchmove', this.handleMouseMove);
    };
    Splitter.prototype.handleMouseMove = function (e) {
        /********************************
        * check if the state is still isDragging, if not, stop the function
        * unselectAll - unselect all selected text
        * check position of mouse in the splitter and and set the width or height of primary pane
        * save last positions of X and Y coords (that is necessary for touch screen)
        ********************************/
        if (!this.state.isDragging) {
            return;
        }
        Helpers_1.unselectAll();
        var _a = this.state, handleBarOffsetFromParent = _a.handleBarOffsetFromParent, maxMousePosition = _a.maxMousePosition;
        var _b = this.props, position = _b.position, primaryPaneMinWidth = _b.primaryPaneMinWidth, primaryPaneMinHeight = _b.primaryPaneMinHeight, postPoned = _b.postPoned;
        var clientX;
        var clientY;
        if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        else if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        var primaryPanePosition;
        switch (position) {
            case 'horizontal': {
                if (clientY > maxMousePosition) {
                    primaryPanePosition = maxMousePosition - handleBarOffsetFromParent;
                }
                else if ((clientY - handleBarOffsetFromParent) <= primaryPaneMinHeight) {
                    primaryPanePosition = primaryPaneMinHeight + 0.001;
                }
                else {
                    primaryPanePosition = clientY - handleBarOffsetFromParent;
                }
                break;
            }
            case 'vertical':
            default: {
                if (clientX > maxMousePosition) {
                    primaryPanePosition = maxMousePosition - handleBarOffsetFromParent;
                    // TODO: blink the handlebar on max size
                }
                else if ((clientX - handleBarOffsetFromParent) <= primaryPaneMinWidth) {
                    primaryPanePosition = primaryPaneMinWidth + 0.001;
                }
                else {
                    primaryPanePosition = clientX - handleBarOffsetFromParent;
                }
                break;
            }
        }
        if (postPoned) {
            this.setState({
                handleBarClonePosition: primaryPanePosition,
                lastX: clientX,
                lastY: clientY,
                isVisible: true
            });
        }
        else {
            this.setState({
                primaryPane: primaryPanePosition,
                lastX: clientX,
                lastY: clientY
            });
        }
    };
    Splitter.prototype.handleMouseUp = function (e) {
        /********************************
        * Dispatch event is for components which resizes on window resize
        ********************************/
        if (!this.state.isDragging) {
            return;
        }
        var _a = this.state, handleBarOffsetFromParent = _a.handleBarOffsetFromParent, lastX = _a.lastX, lastY = _a.lastY;
        var primaryPanePosition;
        switch (this.props.position) {
            case 'horizontal': {
                if (lastY > this.state.maxMousePosition) {
                    primaryPanePosition = this.state.maxMousePosition - handleBarOffsetFromParent;
                }
                else if ((lastY - handleBarOffsetFromParent) <= this.props.primaryPaneMinHeight) {
                    primaryPanePosition = this.props.primaryPaneMinHeight + 0.001;
                }
                else {
                    primaryPanePosition = lastY - handleBarOffsetFromParent;
                }
                break;
            }
            case 'vertical':
            default: {
                if (lastX >= this.state.maxMousePosition) {
                    primaryPanePosition = this.state.maxMousePosition - handleBarOffsetFromParent;
                    // TODO: blink the handlebar on max size
                }
                else if ((lastX - handleBarOffsetFromParent) <= this.props.primaryPaneMinWidth) {
                    primaryPanePosition = this.props.primaryPaneMinWidth + 0.001;
                }
                else {
                    primaryPanePosition = lastX - handleBarOffsetFromParent;
                }
                break;
            }
        }
        if (this.props.postPoned) {
            this.setState({
                isDragging: false,
                isVisible: false,
                primaryPane: primaryPanePosition
            });
        }
        else {
            this.setState({
                isDragging: false,
                primaryPane: primaryPanePosition
            });
        }
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('touchmove', this.handleMouseMove);
        // call resize event to trigger method for updating of DataGrid width
        // TODO: add this event for IE11
        if (typeof this.props.dispatchResize === 'boolean') {
            window.dispatchEvent(new Event('resize'));
        }
        // callback function from parent component
        if (typeof this.props.onDragFinished === 'function') {
            this.props.onDragFinished();
        }
        if (React.Children.count(this.props.children) > 1) {
            this.getSize(lastX, lastY);
        }
    };
    Splitter.prototype.render = function () {
        var _this = this;
        /********************************
         * set width of primary pane according to props, or state
        ********************************/
        var _a = this.props, children = _a.children, position = _a.position, primaryPaneMinWidth = _a.primaryPaneMinWidth, primaryPaneWidth = _a.primaryPaneWidth, primaryPaneMaxWidth = _a.primaryPaneMaxWidth, primaryPaneMinHeight = _a.primaryPaneMinHeight, primaryPaneHeight = _a.primaryPaneHeight, primaryPaneMaxHeight = _a.primaryPaneMaxHeight, className = _a.className, primaryPaneClassName = _a.primaryPaneClassName, secondaryPaneClassName = _a.secondaryPaneClassName, maximizedPrimaryPane = _a.maximizedPrimaryPane, minimalizedPrimaryPane = _a.minimalizedPrimaryPane, postPoned = _a.postPoned, allowResize = _a.allowResize;
        var _b = this.state, handleBarClonePosition = _b.handleBarClonePosition, primaryPane = _b.primaryPane, isVisible = _b.isVisible;
        var paneStyle;
        switch (position) {
            case 'vertical': {
                if (maximizedPrimaryPane) {
                    paneStyle = {
                        width: '100%',
                        minWidth: primaryPaneMinWidth,
                        maxWidth: '100%'
                    };
                }
                else if (minimalizedPrimaryPane) {
                    paneStyle = {
                        width: '0px',
                        minWidth: 0,
                        maxWidth: primaryPaneMaxWidth
                    };
                }
                else {
                    paneStyle = {
                        width: primaryPane ? primaryPane + "px" : primaryPaneWidth,
                        minWidth: primaryPaneMinWidth,
                        maxWidth: primaryPaneMaxWidth
                    };
                }
                break;
            }
            case 'horizontal': {
                if (maximizedPrimaryPane) {
                    paneStyle = {
                        height: '100%',
                        minHeight: 0,
                        maxHeight: '100%'
                    };
                }
                else if (minimalizedPrimaryPane) {
                    paneStyle = {
                        height: '0px',
                        minHeight: 0,
                        maxHeight: primaryPaneMaxHeight
                    };
                }
                else {
                    paneStyle = {
                        height: primaryPane ? primaryPane + "px" : primaryPaneHeight,
                        minHeight: primaryPaneMinHeight,
                        maxHeight: primaryPaneMaxHeight
                    };
                }
                break;
            }
        }
        if (!children[1]) {
            var onePaneStyle = {
                width: '100%',
                maxWidth: '100%',
                height: '100%'
            };
        }
        var handlebarClone;
        if (React.Children.count(children) > 1 && postPoned) {
            handlebarClone = (_c = {},
                _c[position === 'vertical' ? 'left' : 'top'] = handleBarClonePosition + 'px',
                _c);
        }
        return (React.createElement("div", { className: "splitter " + (position === 'vertical' ? 'vertical' : 'horizontal') + " " + (className || ''), style: onePaneStyle !== 'undefined' ? onePaneStyle : null, ref: function (node) { return _this.paneWrapper = node; } },
            React.createElement(Pane_1.default, { className: "primary " + (primaryPaneClassName || ''), position: position, style: paneStyle, ref: function (node) { return _this.panePrimary = node; } }, !children[1] ? children : children[0]),
            children[1]
                ? React.createElement(HandleBar_1.default, { position: position, handleMouseDown: this.handleMouseDown, ref: function (node) { return _this.handlebar = node; }, allowResize: allowResize })
                : null,
            postPoned && isVisible
                ? React.createElement("div", { className: "handle-bar handle-bar_clone " + (position === 'vertical' ? 'vertical' : 'horizontal') + " ", style: handlebarClone })
                : null,
            children[1]
                ? React.createElement(Pane_1.default, { className: secondaryPaneClassName || '', position: position, hasDetailPane: this.props.hasDetailPane, ref: function (node) { return _this.paneNotPrimary = node; } }, children[1])
                : null));
        var _c;
    };
    ;
    return Splitter;
}(React.Component));
Splitter.defaultProps = {
    position: 'vertical',
    postPoned: false,
    dispatchResize: false,
    primaryPaneMaxWidth: '80%',
    primaryPaneMinWidth: 300,
    primaryPaneWidth: '50%',
    primaryPaneMaxHeight: '80%',
    primaryPaneMinHeight: 300,
    primaryPaneHeight: '50%'
};
exports.Splitter = Splitter;
