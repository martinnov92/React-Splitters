import * as React from 'react';
import { PaneProps } from './typings/index';

class Pane extends React.Component<PaneProps, {}> {
    div: HTMLDivElement;

    render() {
        const { hasDetailPane, id, style, position, className } = this.props;

        const classNames = [
            'pane',
            hasDetailPane && 'bottom-detail-pane',
            position,
            className
        ].filter((cls) => cls).join(' ');

        return (
            <div
                id={id}
                ref={(node: HTMLDivElement) => this.div = node}
                className={classNames}
                style={style}
            >
                {this.props.children}
            </div>
        );
    }

    getDivInstance = () => {
        return this.div;
    }
}

export default Pane;