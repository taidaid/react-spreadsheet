import React from "react";
import Cell from "./Cell";

const Row = props => {
  const cells = [];
  const y = props.y;
  for (let x = 0; x <= props.x; x++) {
    cells.push(
      <Cell
        key={`${x}-${y}`}
        y={y}
        x={x}
        history={props.history}
        onChangedValue={props.handleChangedCell}
        updateCells={props.updateCells}
        value={props.rowData[x] || ""}
        // fillTopbar={props.fillTopbar}
        executeFormula={props.executeFormula}
      />
    );
  }
  return <div>{cells}</div>;
};

export default Row;
