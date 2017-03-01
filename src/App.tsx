import * as React from 'react';
import Splitter from './components/Splitters/Splitter';

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
        <div className="splitter-wrapper">
          <Splitter
            position="horizontal"
            primaryPaneMaxHeight="80%"
            primaryPaneMinHeight={0}
            primaryPaneHeight="400px"
            dispatchResize={true}
            maximizedPrimaryPane={this.state.maxPrimaryPane}
            minimalizedPrimaryPane={false}
            postPoned={false}
            className="split"
          >            
            <Splitter
                position="vertical"
                primaryPaneMaxWidth="70%"
                primaryPaneMinWidth={0}
                primaryPaneWidth="400px"
                dispatchResize={true}
                postPoned={true}
              >
                <div />
                <div />
            </Splitter>
            <div />
          </Splitter>         
        </div>
      </div>
    );
  }
}

export default App;
