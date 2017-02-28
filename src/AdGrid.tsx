const ReactDataGrid = require('react-data-grid');
import * as React from 'react';

interface ExampleState {
  rows: any;
  columns: any;
}

export default class Example extends React.Component<{}, ExampleState> {
  constructor() {
    super();
    let rows = [];
    for (let i = 1; i < 1000; i++) {
      rows.push({
        id: i,
        title: 'Title ' + i,
        count: i * 1000
      });
    }

    this.state = {
      rows: rows,
      columns: [
        { key: 'id', name: 'ID' },
        { key: 'title', name: 'Title' },
        { key: 'count', name: 'Count' } 
      ]
    };
  }
  
  createRows() {
    let rows = [];
    for (let i = 1; i < 1000; i++) {
      rows.push({
        id: i,
        title: 'Title ' + i,
        count: i * 1000
      });
    }
    this.setState({
      rows: rows
    })
  }

  rowGetter(i: any) {
    return this.state.rows[i];
  }

  render() {
    return  (
      <ReactDataGrid
        columns={this.state.columns}
        rowGetter={this.rowGetter.bind(this)}
        rowsCount={1000}
        minHeight={500} />);
  }
}