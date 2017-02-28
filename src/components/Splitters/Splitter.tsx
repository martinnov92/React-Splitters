import * as React from 'react';
import * as ReactDOM from 'react-dom';
/********************************
* import files needed for splitter to work
********************************/
import Pane from './Pane';
import HandleBar from './HandleBar';
import './splitters.css';
import { unselectAll } from './Helpers';
import { SplitterProps, SplitterState } from './index';

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
        /********************************/
        // This function calculate the max position of a mouse in the current splitter.
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
                Math.floor((nodeWrapperSize * (parseFloat(this.props.primaryPaneMaxWidth.replace("%", "")) / 100)) + primaryPaneOffset + handleBarSize.width);
        } else {
            nodeWrapperSize = wrapper.height;
            primaryPaneOffset = primaryPane.top;
            maxMousePosInSplitterFromPercentage =
                Math.floor((nodeWrapperSize * (parseFloat(this.props.primaryPaneMaxHeight.replace("%", "")) / 100)) + primaryPaneOffset + handleBarSize.height);
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
            window.addEventListener("resize", this.getSize);
        }
    }

    handleMouseDown(e: any) {
        /********************************
        * If the button someone clicked is right button => function stops
        * If there is more then one pane, we get the sizes of panes + max pos of mouse in splitter
        * state is set to isDragging on mouse down and the offset of handlebar from parent element
        * is calculated and saved to state
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
        * check position of mouse in splitter and and set the width, or height of primary pane
        * save last positions of X and Y coords (that is necessary for touch screen)
        ********************************/
        if (!this.state.isDragging) {
          return;  
        }
        unselectAll();

        const { handleBarOffsetFromParent } = this.state;
        let primaryPanePosition;
        let clientX;
        let clientY;

        if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        switch (this.props.position) {
            case 'horizontal': {
                if (clientY > this.state.maxMousePosInSplitterFromPercentage) {
                    primaryPanePosition = this.state.maxMousePosInSplitterFromPercentage;
                } else if ((clientY - handleBarOffsetFromParent) <= this.props.primaryPaneMinHeight) {
                    primaryPanePosition = this.props.primaryPaneMinHeight + 0.001;
                } else {
                    primaryPanePosition = clientY - handleBarOffsetFromParent;
                }
                break;
            }
            case 'vertical':
            default: {
                if (clientX > this.state.maxMousePosInSplitterFromPercentage) {
                    primaryPanePosition = this.state.maxMousePosInSplitterFromPercentage;
                    // TODO: blink the handlebar on max size
                } else if ((clientX - handleBarOffsetFromParent) <= this.props.primaryPaneMinWidth) {
                    primaryPanePosition =  this.props.primaryPaneMinWidth + 0.001;
                } else {
                    primaryPanePosition = clientX - handleBarOffsetFromParent;
                }
                break;
            }
        }

        this.setState({    
            primaryPane: primaryPanePosition,
            lastX: clientX,
            lastY: clientY
        });
    }

    handleMouseUp() {
        /********************************
        * check if the state is still isDragging, if not, stop the function
        * check position of mouse in splitter and and set the width, or height of primary pane
        *** I had to do this here as well, because sometimes mouse gets out of viewport and the width 
        *** was set to 3000px,...
        * Dispatch event is for components which resizes on window resize
        * and last step is to check sizes
        ********************************/
        if (!this.state.isDragging) {
            return;
        }

        const { handleBarOffsetFromParent, lastX, lastY } = this.state;

        let primaryPanePosition;
        switch (this.props.position) {
            case 'horizontal': {
                if (lastY > this.state.maxMousePosInSplitterFromPercentage) {
                    primaryPanePosition = this.state.maxMousePosInSplitterFromPercentage;
                } else if ((lastY - handleBarOffsetFromParent) <= this.props.primaryPaneMinHeight) {
                    primaryPanePosition = this.props.primaryPaneMinHeight + 0.001;
                } else {
                    primaryPanePosition = lastY - handleBarOffsetFromParent;
                }
                break;
            }
            case 'vertical':
            default: {
                if (lastX > this.state.maxMousePosInSplitterFromPercentage) {
                    primaryPanePosition = this.state.maxMousePosInSplitterFromPercentage;
                    // TODO: blink the handlebar on max size
                } else if ((lastX - handleBarOffsetFromParent) <= this.props.primaryPaneMinWidth) {
                    primaryPanePosition = this.props.primaryPaneMinWidth + 0.001;
                } else {
                    primaryPanePosition = lastX - handleBarOffsetFromParent;
                }
                break;
            }
        }

        this.setState({
            isDragging: false,
            primaryPane: primaryPanePosition
        });

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
        const { children, position, 
                primaryPaneMinWidth, primaryPaneWidth, primaryPaneMaxWidth,
                primaryPaneMinHeight, primaryPaneHeight, primaryPaneMaxHeight, 
                className, primaryPaneClassName, secondaryPaneClassName,
                maximizedPrimaryPane, minimalizedPrimaryPane } = this.props;
        let paneStyle;

        switch (position) {
            case "vertical":
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
                        width: this.state.primaryPane ? `${this.state.primaryPane}px` : primaryPaneWidth,
                        minWidth: primaryPaneMinWidth,
                        maxWidth: primaryPaneMaxWidth
                    };
                }
                break;
            case "horizontal": {
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
                        height: this.state.primaryPane ? `${this.state.primaryPane}px` : primaryPaneHeight,
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

        return (
            <div 
                className={`splitter ${ position === 'vertical' ? 'vertical' : 'horizontal' } ${ className || ''}`} 
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
                    this.state.isDragging
                    ? <div 
                        className="handle-bar vertical"
                        style={{position: "absolute", left: this.state.primaryPane + "px"}}
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