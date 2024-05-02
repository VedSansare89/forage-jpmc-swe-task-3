import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator'; // Import DataManipulator for generating rows
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return <perspective-viewer></perspective-viewer>; // Use JSX syntax
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;

    const schema = {
      ratio: 'float', // Add ratio field
      upper_bound: 'float', // Add upper_bound field
      lower_bound: 'float', // Add lower_bound field
      trigger_alert: 'boolean', // Add trigger_alert field
      price_abc: 'float', // Add price_abc field
      price_def: 'float', // Add price_def field
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      // Remove 'column-pivots' attribute to track ratio between two stocks
      elem.setAttribute('row-pivots', '["timestamp"]');
      // Change 'columns' attribute to include ratio, upper_bound, lower_bound, and trigger_alert
      elem.setAttribute('columns', '["ratio", "upper_bound", "lower_bound", "trigger_alert"]');
      // Update 'aggregates' attribute to handle duplicate data and include ratio, upper_bound, lower_bound, and trigger_alert
      elem.setAttribute('aggregates', JSON.stringify({
        ratio: 'avg', // Use 'avg' to calculate average ratio
        upper_bound: 'avg', // Use 'avg' to calculate average upper_bound
        lower_bound: 'avg', // Use 'avg' to calculate average lower_bound
        trigger_alert: 'any', // Use 'any' to check if any trigger_alert is true
        timestamp: 'distinct count',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(
        DataManipulator.generateRow(this.props.data), // Use DataManipulator to generate rows
      );
    }
  }
}

export default Graph;

