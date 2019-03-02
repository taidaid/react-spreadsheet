import React, { useState } from "react";

const TableForm = props => {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  const handleChange = e => {
    const value = e.target.value;
    if (e.target.name === "rows") {
      setRows(value);
    }
    if (e.target.name === "cols") {
      setCols(value);
    }
  };

  const handleSubmit = e => {
    props.setTableRowsAndColumns(cols, rows);
    props.history.push("/table");
    e.preventDefault();
  };

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <label>
        Rows:
        <input
          type="text"
          value={rows}
          name="rows"
          onChange={e => handleChange(e)}
        />
      </label>
      <label>
        Columns:
        <input
          type="text"
          value={cols}
          name="cols"
          onChange={e => handleChange(e)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
};

export default TableForm;
