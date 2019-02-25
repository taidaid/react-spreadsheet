import React, { Component } from "react";
import { Parser as FormulaParser } from "hot-formula-parser";
import Row from "./Row";

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.parser = new FormulaParser();
    this.state = {
      data: {}
    };
  }

  handleChangedCell = ({ x, y }, value) => {
    const modifiedData = Object.assign({}, this.state.data);
    if (!modifiedData[y]) modifiedData[y] = {};
    modifiedData[y][x] = value;
    this.setState({ data: modifiedData });
  };

  updateCells = () => {
    this.forceUpdate();
  };

  render() {
    const rows = [];

    for (let y = 0; y <= this.props.y; y++) {
      const rowData = this.state.data[y] || {};
      rows.push(
        <Row
          handleChangedCell={this.handleChangedCell}
          updateCells={this.updateCells}
          key={y}
          y={y}
          x={this.props.x}
          rowData={rowData}
        />
      );
    }
    return <div>{rows}</div>;
  }
}
