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
          <Route
            path="/table"
            render={({ history }) => (
              <div id="App" style={{ width: "max-content" }}>
                <Table
                  x={this.state.cols}
                  y={this.state.rows}
                  id={"1"}
                  history={history}
                />
              </div>
            )}
          />
          <Route
            render={({ history }) => (
              <TableForm
                history={history}
                setTableRowsAndColumns={this.setTableRowsAndColumns}
              />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
