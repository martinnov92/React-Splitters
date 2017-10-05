import * as React from 'react';

import Splitter from './components/Splitters';

interface AppState {
  maxPrimaryPane?: Boolean;
}

class App extends React.Component<{}, AppState> {
  state = {
    maxPrimaryPane: false
  };

  maxPrimaryPane() {
    this.setState({
      maxPrimaryPane: !this.state.maxPrimaryPane
    });
  };

  onDragFinishedCallback() {
    console.log('callback');
  };

  render() {
    return (
      <div className="app">
        <div className="splitter-wrapper">
          <Splitter
            position="horizontal"
            maximizedPrimaryPane={this.state.maxPrimaryPane}
            minimalizedPrimaryPane={false}
            onDragFinished={this.onDragFinishedCallback}
            className="split"
          >            
            <Splitter
              position="vertical"
              primaryPaneMaxWidth="100%"
              primaryPaneMinWidth={0}
              primaryPaneWidth="400px"
              onDragFinished={this.onDragFinishedCallback}
              dispatchResize={true}
              postPoned={false}
              allowResize={true}
            >
              <div className="placeholder _1">
                <span>1</span>
                <p>postponed</p>
                <p>primary</p>
              </div>
              <Splitter
                  position="vertical"
                  primaryPaneMaxWidth="100%"
                  primaryPaneMinWidth={0}
                  primaryPaneWidth="400px"
                  onDragFinished={this.onDragFinishedCallback}
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
