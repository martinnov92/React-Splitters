import * as React from 'react';

import Splitter from './components/Splitters';

interface AppState {
  maxPrimaryPane?: Boolean;
}

class App extends React.Component<{}, AppState> {
  state = {
    maxPrimaryPane: false
  };

  maxPrimaryPane = () => {
    this.setState({
      maxPrimaryPane: !this.state.maxPrimaryPane
    });
  }

  onDragFinishedCallback = () => {
    console.log('callback');
  }

  render() {
    return (
      <div className="app">
        <div className="splitter-wrapper">
          <Splitter
            position="vertical"
            maximizedPrimaryPane={this.state.maxPrimaryPane}
            minimalizedPrimaryPane={false}
            onDragFinished={this.onDragFinishedCallback}
            primaryPaneMaxWidth="100%"
            className="split"
          >
            <Splitter
              position="vertical"
              maximizedPrimaryPane={this.state.maxPrimaryPane}
              minimalizedPrimaryPane={false}
              onDragFinished={this.onDragFinishedCallback}
              primaryPaneMaxWidth="100%"
              className="split"
            >
              <div style={{ backgroundColor: 'red', height: '100%', width: '100%', position: 'absolute' }}>
              </div>
              <div>
              </div>
            </Splitter>
            <div>
            </div>
          </Splitter>
        </div>
      </div>
    );
  }
}

export default App;
