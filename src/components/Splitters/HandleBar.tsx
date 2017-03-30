import * as React from 'react';
import { HandleBarProps } from './typings/index';

class HandleBar extends React.Component<HandleBarProps, {}> {
    public static defaultProps: Partial<HandleBarProps> = {
        allowResize: true
    };

    render() {
        const { position, handleMouseDown, allowResize } = this.props;
        let allowResizeClass = allowResize ? '' : 'resize-not-allowed';
        return (
            <div 
                className={`handle-bar ${position} ${allowResizeClass}`} 
                onMouseDown={(e) => handleMouseDown(e)} 
                onTouchStart={(e) => handleMouseDown(e)}
            >
                <span className="handle-bar_drag" />
            </div>
        );
    };
}

export default HandleBar;