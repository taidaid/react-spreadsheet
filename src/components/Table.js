import React, { Component } from "react";
import { Parser as FormulaParser } from "hot-formula-parser";
import Row from "./Row";
import Topbar from "./Topbar";

export default class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
    this.tableIdentifier = `tableData-${props.id}`;
    this.parser = new FormulaParser();
    // When a formula contains a cell value, this event lets us
    // hook and return an error value if necessary
    this.parser.on("callCellValue", (cellCoord, done) => {
      const x = cellCoord.column.index + 1;
      const y = cellCoord.row.index + 1;

      // Check if I have that coordinates tuple in the table range
      if (x > this.props.x || y > this.props.y) {
        throw this.parser.Error(this.parser.ERROR_NOT_AVAILABLE);
      }

      // Check that the cell is not self referencing
      if (this.parser.cell.x === x && this.parser.cell.y === y) {
        throw this.parser.Error(this.parser.ERROR_REF);
      }

      if (!this.state.data[y] || !this.state.data[y][x]) {
        return done("");
      }

      // All fine
      return done(this.state.data[y][x]);
    });

    // When a formula contains a range value, this event lets us
    // hook and return an error value if necessary
    this.parser.on("callRangeValue", (startCellCoord, endCellCoord, done) => {
      const sx = startCellCoord.column.index + 1;
      const sy = startCellCoord.row.index + 1;
      const ex = endCellCoord.column.index + 1;
      const ey = endCellCoord.row.index + 1;
      const fragment = [];

      for (let y = sy; y <= ey; y += 1) {
        const row = this.state.data[y];
        if (!row) {
          continue;
        }

        const colFragment = [];

        for (let x = sx; x <= ex; x += 1) {
          let value = row[x];
          if (!value) {
            value = "";
          }

          if (value.slice(0, 1) === "=") {
            const res = this.executeFormula({ x, y }, value.slice(1));
            if (res.error) {
              throw this.parser.Error(res.error);
            }
            value = res.result;
          }

          colFragment.push(value);
        }
        fragment.push(colFragment);
      }

      if (fragment) {
        done(fragment);
      }
    });
    this.fillTopbar = this.fillTopbar.bind(this);
  }

  componentWillMount() {
    if (this.props.saveToLocalStorage && window && window.localStorage) {
      const data = window.localStorage.getItem(this.tableIdentifier);
      if (data) {
        this.setState({ data: JSON.parse(data) });
      }
    }
  }
  /*
   * Using (this.state.selected === true) as trigger for filling Topbar with value of selected cell
   * If more than one cell is selected, fill Topbar with indicating message
   */
  fillTopbar = (cell, value) => {
    if (!cell || !value) return "";
    console.log("Topbar");
    return value;
  };

  /**
   * Executes the formula on the `value` using the
   * FormulaParser object
   */
  executeFormula = (cell, value) => {
    this.parser.cell = cell;
    let res = this.parser.parse(value);
    if (res.error != null) {
      return res; // tip: returning `res.error` shows more details
    }
    if (res.result.toString() === "") {
      return res;
    }
    if (res.result.toString().slice(0, 1) === "=") {
      // formula points to formula
      res = this.executeFormula(cell, res.result.slice(1));
    }

    return res;
  };

  handleChangedCell = ({ x, y }, value) => {
    const modifiedData = Object.assign({}, this.state.data);
    if (!modifiedData[y]) modifiedData[y] = {};
    modifiedData[y][x] = value;
    this.setState({ data: modifiedData });
    if (window && window.localStorage) {
      window.localStorage.setItem(
        this.tableIdentifier,
        JSON.stringify(modifiedData)
      );
    }
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
          fillTopbar={this.fillTopbar}
          executeFormula={this.executeFormula}
        />
      );
    }

    // const topbarWithValue = <Topbar value={this.fillTopbar()} />;
    return (
      <div>
        <Topbar value={this.fillTopbar()} />
        <div>{rows}</div>
      </div>
    );
  }
}
