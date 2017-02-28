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
                <span className="arrow">
                    <i className={`fa fa-ellipsis-v ${position === 'horizontal' ? 'rotate-90' : ''}`} />
                </span>
            </div>
        );
    }
}

export default HandleBar;