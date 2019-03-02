import React from "react";
import Table from "./components/Table";
import TableForm from "./components/TableForm";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// TODO:
// -implement dynamic Table.id and multiple Tables through initial setup form
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 4,
      cols: 4,
      tables: []
    };
  }

  setTableRowsAndColumns = (x, y) => {
    console.log(x, y);
    this.setState({ rows: y, cols: x });
  };

  render() {
    return (
      <Router>
        <Switch>
          <div style={{ width: "max-content" }}>
            <Route
              path="/table"
              render={({ history }) => {
                return (
                  <Table
                    x={this.state.cols}
                    y={this.state.rows}
                    id={"1"}
                    history={history}
                  />
                );
              }}
            />
            <Route
              render={({ history }) => {
                return (
                  <TableForm
                    history={history}
                    setTableRowsAndColumns={this.setTableRowsAndColumns}
                  />
                );
              }}
            />
          </div>
        </Switch>
      </Router>
    );
  }
}

export default App;
