import * as React from 'react';
import { HandleBarProps } from './index';

class HandleBar extends React.Component<HandleBarProps, {}> {
    render() {
        const { position, handleMouseDown } = this.props;
        return (
            <div 
                className={`handle-bar ${position}`} 
                onMouseDown={(e) => handleMouseDown(e)} 
                onTouchStart={(e) => handleMouseDown(e)}
            >
                <span className="handle-bar_drag" />
            </div>
        );
    }
}

export default HandleBar;