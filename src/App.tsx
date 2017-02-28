import * as React from 'react';
import Splitter from './components/Splitters/Splitter';
import ToggleButton from './components/ToggleButton/ToggleButton';
import Example from './AdGrid';

interface AppState {
  maxPrimaryPane?: Boolean
}

class App extends React.Component<null, AppState> {
  state = {
    maxPrimaryPane: false
  }
  maxPrimaryPane() {
    this.setState({
      maxPrimaryPane: !this.state.maxPrimaryPane
    });
  }
  render() {
    return (
      <div className="app">
        <div className="top-panel">
          <ToggleButton
            label="Right side"
            handleChange={this.maxPrimaryPane.bind(this)}
            dispatchResize={true}
          />
        </div>
        <div style={{padding: "10px", width: "100%", height: "100%"}}>
          <Splitter
            position="vertical"
            primaryPaneMaxWidth="80%"
            primaryPaneMinWidth={0}
            primaryPaneWidth="400px"
            dispatchResize={true}
            maximizedPrimaryPane={this.state.maxPrimaryPane}
            minimalizedPrimaryPane={false}
            postPoned={true}
            className="split"
          >
            <div>
              <Example />
            </div>
            <div>
              <Example />
            </div>
          </Splitter>
        </div>
      </div>
    );
  }
}

export default App;
