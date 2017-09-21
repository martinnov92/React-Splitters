import * as React from 'react';
import { PaneProps } from './typings/index';

class Pane extends React.Component<PaneProps, {}> {
    render() {
        const {
            id,
            style,
            position,
            className,
            hasDetailPane
        } = this.props;

        const isDetailPane = hasDetailPane ? 'bottom-detail-pane' : null;
        const classNames = [
            'pane',
            isDetailPane,
            position || null,
            className || null
        ].filter((cls) => cls !== null).join(' ');

        return (
            <div
                id={id}
                className={classNames}
                style={style}
            >
                {this.props.children}
            </div>
        );
    }
}

export default Pane;