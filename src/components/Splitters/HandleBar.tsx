import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { HandleBarProps } from './typings/index';

class HandleBar extends React.Component<HandleBarProps, {}> {
    div: HTMLDivElement;

    public static defaultProps: Partial<HandleBarProps> = {
        allowResize: true
    };

    render() {
        const { position, handleMouseDown, allowResize } = this.props;

        const classNames = [
            'handle-bar',
            position,
            !allowResize && 'resize-not-allowed',
        ].filter((cls) => cls).join(' ');

        return (
            <div 
                className={classNames} 
                ref={(node: HTMLDivElement) => this.div = node}
                onMouseDown={(e) => handleMouseDown(e)} 
                onTouchStart={(e) => handleMouseDown(e)}
            >
                <span className="handle-bar_drag" />
            </div>
        );
    }

    getDivInstance = () => {
        return ReactDOM.findDOMNode(this.div);
    }
}

export default HandleBar;