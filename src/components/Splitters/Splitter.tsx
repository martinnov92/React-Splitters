import * as React from 'react';
import * as ReactDOM from 'react-dom';
/********************************
* import files needed for splitter to work
********************************/
import Pane from './Pane';
import HandleBar from './HandleBar';
import { unselectAll, getPrimaryPaneWidth } from './helpers';
import { SplitterProps, SplitterState } from './typings/index';
import './splitters.css';

// TODO: 
// * uložit stav splitteru do localStorage,nebo někam jinam, bude na to callback funkce

export class Splitter extends React.Component<SplitterProps, SplitterState> {
    public static defaultProps: Partial<SplitterProps> = {
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
    
    paneWrapper: any;
    panePrimary: any;
    handlebar: any;
    paneNotPrimary: any;

    constructor() {
        super();
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.getSize = this.getSize.bind(this);
        this.state = {
            isDragging: false
        };
    }

    getSize(cX?: Number | any, cY?: Number | any) {
        /********************************
        * This function calculates the max position of a mouse in the current splitter from given percentage.
        /********************************/
        let maxMousePosition;
        let nodeWrapperSize;
        let primaryPaneOffset;
        let wrapper = ReactDOM.findDOMNode(this.paneWrapper).getBoundingClientRect();
        let primaryPane = ReactDOM.findDOMNode(this.panePrimary).getBoundingClientRect();
        let handleBarSize = ReactDOM.findDOMNode(this.handlebar).getBoundingClientRect();
        const posInHandleBar = this.props.position === 'vertical' 
            ? handleBarSize.left - cX
            : handleBarSize.top - cY;

        // find only letters from string
        const regEx = new RegExp(/\D+/gi);
         
        if (this.props.position === 'vertical') {
            // split the maxWidth/maxHeight string to string and numbers
            let maxWidthStr = this.props.primaryPaneMaxWidth.match(regEx)[0].toLowerCase();
            let maxWidthNum = parseFloat(this.props.primaryPaneMaxWidth.split(regEx)[0]);
            nodeWrapperSize = wrapper.width;
            primaryPaneOffset = primaryPane.left;

            if (maxWidthStr === '%') {
                maxMousePosition =
                    Math.floor((nodeWrapperSize * (maxWidthNum / 100)) + primaryPaneOffset - (handleBarSize.width + posInHandleBar));
            } else if (maxWidthStr === 'px') {
                maxMousePosition =
                    Math.floor((maxWidthNum + primaryPaneOffset) - handleBarSize.width);
            }
        } else {
            let maxHeightStr = this.props.primaryPaneMaxHeight.match(regEx)[0].toLowerCase();
            let maxHeightNum = parseFloat(this.props.primaryPaneMaxHeight.split(regEx)[0]);
            nodeWrapperSize = wrapper.height;
            primaryPaneOffset = primaryPane.top;

            if (maxHeightStr === '%') {
                maxMousePosition =
                    Math.floor((nodeWrapperSize * (maxHeightNum / 100)) + primaryPaneOffset - (handleBarSize.height + posInHandleBar));
            } else if (maxHeightStr === 'px') {
                maxMousePosition =
                    Math.floor((maxHeightNum + primaryPaneOffset) - handleBarSize.height);
            }
        }

        this.setState({
            maxMousePosition
        });
    }

    componentDidMount() {
        /********************************
        * Sets event listeners after component is mounted.
        * If there is only one pane, the resize event listener won't be added
        ********************************/
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('touchend', this.handleMouseUp);
        if (React.Children.count(this.props.children) > 1) {
            window.addEventListener('resize', this.getSize);
        }
    }

    handleMouseDown(e: any) {
        /********************************
        * If the right button was clicked - stop the function
        * If there is more then one pane, we get the sizes of panes + max pos of mouse in splitter
        * add event listener for touch move and mouse move
        ********************************/
        if (e.button === 2 || this.props.allowResize === false) {
            return;
        }

        let handleBarOffsetFromParent;
        let clientX;
        let clientY;

        if (e.type === 'mousedown') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        if (React.Children.count(this.props.children) > 1) {
            this.getSize(clientX, clientY);
        }

        if (this.props.position === 'horizontal') {
            handleBarOffsetFromParent = clientY - e.target.offsetTop;
        } else if (this.props.position === 'vertical') {
            handleBarOffsetFromParent = clientX - e.target.offsetLeft;
        }

        this.setState({
            isDragging: true,
            handleBarOffsetFromParent
        });
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('touchmove', this.handleMouseMove);
    }

    handleMouseMove(e: any) {
        /********************************
        * check if the state is still isDragging, if not, stop the function
        * unselectAll - unselect all selected text
        * check position of mouse in the splitter and and set the width or height of primary pane
        * save last positions of X and Y coords (that is necessary for touch screen)
        ********************************/
        if (!this.state.isDragging) {
            return;
        }
        
        unselectAll();

        const {
            handleBarOffsetFromParent,
            maxMousePosition
        } = this.state;

        const {
            position,
            primaryPaneMinWidth,
            primaryPaneMinHeight,
            postPoned
        } = this.props;

        let clientX;
        let clientY;

        if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        const primaryPanePosition = getPrimaryPaneWidth(position, clientX, clientY, maxMousePosition, handleBarOffsetFromParent, primaryPaneMinHeight, primaryPaneMinWidth);

        if (postPoned) {
            this.setState({
                handleBarClonePosition: primaryPanePosition,
                lastX: clientX,
                lastY: clientY,
                isVisible: true
            });
        } else {
            this.setState({
                primaryPane: primaryPanePosition,
                lastX: clientX,
                lastY: clientY
            });
        }
    }

    handleMouseUp(e: any) {
        /********************************
        * Dispatch event is for components which resizes on window resize
        ********************************/
        if (!this.state.isDragging) {
            return;
        }

        const {
            handleBarOffsetFromParent,
            lastX, lastY, maxMousePosition
        } = this.state;

        const {
            position,
            primaryPaneMinWidth,
            primaryPaneMinHeight,
            postPoned
        } = this.props;

        const primaryPanePosition = getPrimaryPaneWidth(position, lastX, lastY, maxMousePosition, handleBarOffsetFromParent, primaryPaneMinHeight, primaryPaneMinWidth);

        if (postPoned) {
            this.setState({
                isDragging: false,
                isVisible: false,
                primaryPane: primaryPanePosition
            });
        } else {
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
    }

    render() {
        /********************************
         * set width of primary pane according to props, or state
        ********************************/
        const {
            children, position,
            primaryPaneMinWidth, primaryPaneWidth, primaryPaneMaxWidth,
            primaryPaneMinHeight, primaryPaneHeight, primaryPaneMaxHeight,
            className, primaryPaneClassName, secondaryPaneClassName,
            maximizedPrimaryPane, minimalizedPrimaryPane, postPoned, allowResize
        } = this.props;

        const {
            handleBarClonePosition,
            primaryPane,
            isVisible
        } = this.state;

        let paneStyle;
        switch (position) {
            case 'vertical': {
                if (maximizedPrimaryPane) {
                    paneStyle = {
                        width: '100%',
                        minWidth: primaryPaneMinWidth,
                        maxWidth: '100%'
                    };
                } else if (minimalizedPrimaryPane) {
                    paneStyle = {
                        width: '0px',
                        minWidth: 0,
                        maxWidth: primaryPaneMaxWidth
                    };
                } else {
                    paneStyle = {
                        width: primaryPane ? `${primaryPane}px` : primaryPaneWidth,
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
                } else if (minimalizedPrimaryPane) {
                    paneStyle = {
                        height: '0px',
                        minHeight: 0,
                        maxHeight: primaryPaneMaxHeight
                    };
                } else {
                    paneStyle = {
                        height: primaryPane ? `${primaryPane}px` : primaryPaneHeight,
                        minHeight: primaryPaneMinHeight,
                        maxHeight: primaryPaneMaxHeight
                    };
                }
                break;
            }
        }

        if (!children[1]) {
            var onePaneStyle: any = {
                width: '100%',
                maxWidth: '100%',
                height: '100%'
            };
        }

        let handlebarClone;
        if (React.Children.count(children) > 1 && postPoned) {
            handlebarClone = {
                [position === 'vertical' ? 'left' : 'top']: handleBarClonePosition + 'px'
            };
        }

        return (
            <div
                className={`splitter ${position === 'vertical' ? 'vertical' : 'horizontal'} ${className || ''}`}
                style={onePaneStyle !== 'undefined' ? onePaneStyle : null}
                ref={node => this.paneWrapper = node}
            >
                <Pane
                    className={`primary ${primaryPaneClassName || ''}`}
                    position={position}
                    style={paneStyle}
                    ref={(node) => this.panePrimary = node}
                >
                    {!children[1] ? children : children[0]}
                </Pane>

                {
                    children[1]
                        ? <HandleBar
                            position={position}
                            handleMouseDown={this.handleMouseDown}
                            ref={node => this.handlebar = node}
                            allowResize={allowResize}
                        />
                        : null
                }

                {
                    postPoned && isVisible
                        ? <div
                            className={`handle-bar handle-bar_clone ${position === 'vertical' ? 'vertical' : 'horizontal'} `}
                            style={handlebarClone}
                        />
                        : null
                }

                {
                    children[1]
                        ? <Pane
                            className={secondaryPaneClassName || ''}
                            position={position}
                            hasDetailPane={this.props.hasDetailPane}
                            ref={node => this.paneNotPrimary = node}
                        >
                            {children[1]}
                        </Pane>
                        : null
                }
            </div>
        );
    };
}