import React from "react";
import Table from "./components/Table";

// TODO:
// -implement dynamic Table.id and multiple Tables through initial setup form
const App = () => (
  <div style={{ width: "max-content" }}>
    <Table x={4} y={4} id={"1"} />
  </div>
);

export default App;
