import * as React from 'react';
import './pd-togglebox.less';

interface ToggleButtonState {
    active?: Boolean;
}

interface ToggleButtonProps {
    label?: String;
    handleChange?: Function;
    className?: String;
    dispatchResize?: Boolean;
}

class ToggleButton extends React.Component<ToggleButtonProps, ToggleButtonState> {
    state = {
        active: true
    }
    handleClick() {
        this.setState({
            active: !this.state.active
        });

        // call function from parent component
        this.props.handleChange();

        // dispatch resize event to resize components (grid, map) in splitters
        if (this.props.dispatchResize) {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 10);
        }
    }
    render() {
        const greenBox = this.state.active ? 'active' : '';
        const { className } = this.props;
        return (
            <div className={`pd-togglebox ${greenBox} ${className}`}>
                <input
                    className="pd-togglebox_checkbox"
                    type="checkbox"
                    id="pd-togglebox_checkbox"
                    onChange={this.handleClick.bind(this)}
                />
                <label className="pd-togglebox_label text-bold" htmlFor="pd-togglebox_checkbox">
                    <span>{this.props.label}</span>
                    <i
                        className={`${this.state.active ? 'fa fa-check' : 'fa fa-times'}`}>
                    </i>
                </label>
            </div>
        );
    }
}

export default ToggleButton;