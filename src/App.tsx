import * as React from 'react';

import Splitter from './components/Splitters';

interface AppState {
  maxPrimaryPane?: Boolean;
}

class App extends React.Component<{}, AppState> {
  state = {
    maxPrimaryPane: false
  };

  split: Splitter | null = null;

  maxPrimaryPane = () => {
    this.setState({
      maxPrimaryPane: !this.state.maxPrimaryPane
    });
  }

  onDragFinishedCallback = () => {
    console.log('callback');
    console.log(this.split && this.split.paneWrapper); // actual div
    console.log(this.split && this.split.panePrimary.div.clientWidth);
    console.log(this.split && this.split.paneNotPrimary.div.clientHeight);
  }

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
            ref={(node) => this.split = node}
          >
            <Splitter
              position="vertical"
              primaryPaneMaxWidth="100%"
              primaryPaneMinWidth={0}
              primaryPaneWidth="400px"
              onDragFinished={this.onDragFinishedCallback}
              dispatchResize={true}
              postPoned={true}
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
