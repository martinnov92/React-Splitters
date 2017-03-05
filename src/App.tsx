import * as React from 'react';

import Splitter from '../lib/index';
import '../lib/splitters.css';

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
              <div className="placeholder _1">
                <span>1</span>
                <p>postponed</p>
                <p>primary</p>
              </div>
              <Splitter
                  position="vertical"
                  primaryPaneMaxWidth="80%"
                  primaryPaneMinWidth={0}
                  primaryPaneWidth="400px"
                  postPoned={false}
              >    
                  <div className="placeholder _2">
                    <span>2</span>
                    <p>normal resize</p>
                    <p>primary</p>
                  </div>
                  <div className="placeholder _3"><span>3</span></div>
              </Splitter> 
            </Splitter>
            <div className="placeholder _4">
              <span>4</span>
              <p>normal resize</p>  
            </div>
          </Splitter>         
        </div>
      </div>
    );
  }
}

export default App;
