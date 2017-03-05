import * as React from 'react';
import { PaneProps } from './typings/index';

class Pane extends React.Component<PaneProps, {}> {
    render() {
        const { hasDetailPane, id, style, position, className } = this.props;
        const isDetailPane = hasDetailPane ? 'bottom-detail-pane' : '';
        return (
            <div id={id} className={`pane ${position} ${isDetailPane} ${className || ''}`} style={style}>
                {this.props.children}
            </div>
        );
    }
}

export default Pane;