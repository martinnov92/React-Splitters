import * as React from 'react';
import * as ReactDOM from 'react-dom';
/********************************
* import files needed for splitter to work
********************************/
import Pane from './Pane';
import HandleBar from './HandleBar';
import { unselectAll } from './Helpers';
import { SplitterProps, SplitterState } from './index';
import './splitters.css';

// TODO: 
// * create callback function on drag finished,...
//   v nadřazené komponentě bude funkce, která bude obstarávat co se má stát po vyvolání callback funkce
// * uložit stav splitteru do localStorage,nebo někam jinam, bude na to callback funkce

class Splitter extends React.Component<SplitterProps, SplitterState> {
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

    getSize() {
        /********************************
        * This function calculates the max position of a mouse in the current splitter from given percentage.
        /********************************/
        let maxMousePosInSplitterFromPercentage;
        let nodeWrapperSize;
        let primaryPaneOffset;
        let wrapper = ReactDOM.findDOMNode(this.paneWrapper).getBoundingClientRect();
        let primaryPane = ReactDOM.findDOMNode(this.panePrimary).getBoundingClientRect();
        let handleBarSize = ReactDOM.findDOMNode(this.handlebar).getBoundingClientRect();

        if (this.props.position === 'vertical') {
            nodeWrapperSize = wrapper.width;
            primaryPaneOffset = primaryPane.left;
            maxMousePosInSplitterFromPercentage =
                Math.floor((nodeWrapperSize * (parseFloat(this.props.primaryPaneMaxWidth.replace('%', '')) / 100)) + primaryPaneOffset + handleBarSize.width);
        } else {
            nodeWrapperSize = wrapper.height;
            primaryPaneOffset = primaryPane.top;
            maxMousePosInSplitterFromPercentage =
                Math.floor((nodeWrapperSize * (parseFloat(this.props.primaryPaneMaxHeight.replace('%', '')) / 100)) + primaryPaneOffset + handleBarSize.height);
        }

        this.setState({
            maxMousePosInSplitterFromPercentage
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
        if (e.button === 2) {
            return;
        }

        if (React.Children.count(this.props.children) > 1) {
            this.getSize();
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
            maxMousePosInSplitterFromPercentage
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

        let primaryPanePosition;
        switch (position) {
            case 'horizontal': {
                if (clientY > maxMousePosInSplitterFromPercentage) {
                    primaryPanePosition = maxMousePosInSplitterFromPercentage - handleBarOffsetFromParent;
                } else if ((clientY - handleBarOffsetFromParent) <= primaryPaneMinHeight) {
                    primaryPanePosition = primaryPaneMinHeight + 0.001;
                } else {
                    primaryPanePosition = clientY - handleBarOffsetFromParent;
                }
                break;
            }
            case 'vertical':
            default: {
                if (clientX > maxMousePosInSplitterFromPercentage) {
                    primaryPanePosition = maxMousePosInSplitterFromPercentage - handleBarOffsetFromParent;
                    // TODO: blink the handlebar on max size
                } else if ((clientX - handleBarOffsetFromParent) <= primaryPaneMinWidth) {
                    primaryPanePosition = primaryPaneMinWidth + 0.001;
                } else {
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
        } else {
            this.setState({
                primaryPane: primaryPanePosition,
                lastX: clientX,
                lastY: clientY
            });
        }
    }

    handleMouseUp() {
        /********************************
        * Dispatch event is for components which resizes on window resize
        ********************************/
        if (!this.state.isDragging) {
            return;
        }

        const {
            handleBarOffsetFromParent,
            lastX, lastY
        } = this.state;

        let primaryPanePosition;
        switch (this.props.position) {
            case 'horizontal': {
                if (lastY > this.state.maxMousePosInSplitterFromPercentage) {
                    primaryPanePosition = this.state.maxMousePosInSplitterFromPercentage - handleBarOffsetFromParent;
                } else if ((lastY - handleBarOffsetFromParent) <= this.props.primaryPaneMinHeight) {
                    primaryPanePosition = this.props.primaryPaneMinHeight + 0.001;
                } else {
                    primaryPanePosition = lastY - handleBarOffsetFromParent;
                }
                break;
            }
            case 'vertical':
            default: {
                if (lastX >= this.state.maxMousePosInSplitterFromPercentage) {
                    primaryPanePosition = this.state.maxMousePosInSplitterFromPercentage - handleBarOffsetFromParent;
                    // TODO: blink the handlebar on max size
                } else if ((lastX - handleBarOffsetFromParent) <= this.props.primaryPaneMinWidth) {
                    primaryPanePosition = this.props.primaryPaneMinWidth + 0.001;
                } else {
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
        if (this.props.dispatchResize) {
            window.dispatchEvent(new Event('resize'));
        }

        if (React.Children.count(this.props.children) > 1) {
            this.getSize();
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
            maximizedPrimaryPane, minimalizedPrimaryPane, postPoned
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
    }
}

export default Splitter;