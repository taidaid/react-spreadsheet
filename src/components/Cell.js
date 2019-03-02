import React, { Component } from "react";

/**
 * Cell represents the atomic element of a table
 */
export default class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      selected: false,
      value: props.value
    };
    this.display = this.determineDisplay(
      { x: props.x, y: props.y },
      props.value
    );
    this.timer = 0;
    this.delay = 200;
    this.prevent = false;
  }

  /**
   * Add listener to the `unselectAll` event used to broadcast the
   * unselect all event
   */
  componentDidMount() {
    window.document.addEventListener("unselectAll", this.handleUnselectAll);
  }

  /**
   * Before updating, execute the formula on the Cell value to
   * calculate the `display` value. Especially useful when a
   * redraw is pushed upon this cell when editing another cell
   * that this might depend upon
   */
  componentWillUpdate() {
    this.display = this.determineDisplay(
      { x: this.props.x, y: this.props.y },
      this.state.value
    );
  }

  componentDidUpdate() {
    if (this.state.selected)
      window.document.addEventListener("keydown", this.handleArrowKey);
  }

  /**
   * Remove the `unselectAll` event listener added in
   * `componentDidMount()`
   */
  componentWillUnmount() {
    window.document.removeEventListener("unselectAll", this.handleUnselectAll);
  }

  /**
   * Performance lifesaver as the cell not touched by a change can
   * decide to avoid a rerender
   */
  shouldComponentUpdate(nextProps, nextState) {
    // Has a formula value? could be affected by any change. Update
    if (this.state.value !== "" && this.state.value.slice(0, 1) === "=") {
      return true;
    }

    // Its own state values changed? Update
    // Its own value prop changed? Update
    if (
      nextState.value !== this.state.value ||
      nextState.editing !== this.state.editing ||
      nextState.selected !== this.state.selected ||
      nextProps.value !== this.props.value
    ) {
      return true;
    }

    return false;
  }

  /**
   * When a Cell value changes, re-determine the display value
   * by calling the formula calculation
   */
  onChange = e => {
    this.setState({ value: e.target.value });
    this.display = this.determineDisplay(
      { x: this.props.x, y: this.props.y },
      e.target.value
    );
  };

  /**
   * Handle pressing a key when the Cell is an input element
   */
  onKeyPressOnInput = e => {
    if (e.key === "Enter") {
      this.hasNewValue(e.target.value);
    }
  };

  /**
   * Handle pressing a key when the Cell is a span element,
   * not yet in editing mode
   */
  onKeyPressOnSpan = () => {
    if (!this.state.editing) {
      this.setState({ editing: true });
    }
  };

  /**
   * Handle moving away from a cell, stores the new value
   */
  onBlur = e => {
    this.hasNewValue(e.target.value);
  };

  /**
   * Used by `componentDid(Un)Mount`, handles the `unselectAll`
   * event response
   */
  handleUnselectAll = () => {
    if (this.state.selected || this.state.editing) {
      this.setState({ selected: false, editing: false });
    }
  };

  handleArrowKey = e => {
    if (e.key.slice(0, 5) === "Arrow") {
      this.setState({ selected: false, editing: false });
    }
    // const x = this.props.x;
    // const y = this.props.y;
    // TODO: calculate which cell should be selected and pass along appropriate coords
    // this.props.setNewSelectedCell({ x, y });
    // console.log(this.props.x, this.props.y);
  };

  /**
   * Called by the `onBlur` or `onKeyPressOnInput` event handlers,
   * it escalates the value changed event, and restore the editing
   * state to `false`.
   */
  hasNewValue = value => {
    this.props.onChangedValue(
      {
        x: this.props.x,
        y: this.props.y
      },
      value
    );
    this.setState({ editing: false });
  };

  /**
   * Emits the `unselectAll` event, used to tell all the other
   * cells to unselect
   */
  emitUnselectAllEvent = () => {
    const unselectAllEvent = new Event("unselectAll");
    window.document.dispatchEvent(unselectAllEvent);
  };

  /**
   * Handle clicking a Cell.
   */
  clicked = () => {
    // Prevent click and double click to conflict
    this.timer = setTimeout(() => {
      if (!this.prevent) {
        // Unselect all the other cells and set the current
        // Cell state to `selected`
        this.emitUnselectAllEvent();
        this.setState({ selected: true });
      }
      this.prevent = false;
    }, this.delay);
  };

  /**
   * Handle doubleclicking a Cell.
   */
  doubleClicked = () => {
    // Prevent click and double click to conflict
    clearTimeout(this.timer);
    this.prevent = true;

    // Unselect all the other cells and set the current
    // Cell state to `selected` & `editing`
    this.emitUnselectAllEvent();
    this.setState({ editing: true, selected: true });
  };

  determineDisplay = ({ x, y }, value) => {
    if (value.slice(0, 1) === "=") {
      const res = this.props.executeFormula({ x, y }, value.slice(1));
      if (res.error !== null) {
        return "INVALID";
      }
      return res.result;
    }
    return value;
  };

  fillTopbar = ({ x, y }, value) => {
    this.props.fillTopbar({ x, y }, value);
  };

  //set column headers, if number of columns exceeds alphabet, begin doing "AA", "AB", "AC".
  /*
   * The reason >> works is because it operates only on 32-bit integers, so the value is truncated.
   * (It's also commonly used in cases like these instead of Math.floor because bitwise operators have a low operator precedence,
   * so you can avoid a mess of parentheses.)
   * And since it operates only on 32-bit integers, it's also equivalent to a mask with 0xffffffff after rounding.
   */
  calculateColLabels = indexOfCol => {
    var baseChar = "A".charCodeAt(0),
      letters = "";

    do {
      indexOfCol -= 1;
      letters = String.fromCharCode(baseChar + (indexOfCol % 26)) + letters;
      indexOfCol = (indexOfCol / 26) >> 0; // quick `floor`
    } while (indexOfCol > 0);

    return letters;
  };
  /**
   * Calculates a cell's CSS values
   */
  calculateCss = () => {
    const css = {
      width: "80px",
      padding: "4px",
      margin: "0",
      height: "25px",
      boxSizing: "border-box",
      position: "relative",
      display: "inline-block",
      color: "black",
      border: "1px solid #cacaca",
      textAlign: "left",
      verticalAlign: "top",
      fontSize: "14px",
      lineHeight: "15px",
      overflow: "hidden",
      fontFamily:
        "Calibri, 'Segoe UI', Thonburi,        Arial, Verdana, sans- serif"
    };

    if (this.props.x === 0 || this.props.y === 0) {
      css.textAlign = "center";
      css.backgroundColor = "#f0f0f0";
      css.fontWeight = "bold";
    }
    return css;
  };

  render() {
    const css = this.calculateCss();

    // column 0
    if (this.props.x === 0) {
      return <span style={css}>{this.props.y ? this.props.y : ""}</span>;
    }

    // row 0
    if (this.props.y === 0) {
      return (
        <span style={css} role="presentation">
          {this.calculateColLabels(this.props.x)}
        </span>
      );
    }

    if (this.state.selected) {
      css.outlineColor = "lightblue";
      css.outlineStyle = "dotted";
      // const x = this.props.x;
      // const y = this.props.y;
      // this.fillTopbar({ x, y }, this.state.value);
    }

    if (this.state.editing) {
      return (
        <input
          style={css}
          type="text"
          onBlur={this.onBlur}
          onKeyPress={this.onKeyPressOnInput}
          value={this.state.value}
          onChange={this.onChange}
          autoFocus
        />
      );
    }
    return (
      <span
        onClick={e => this.clicked(e)}
        onDoubleClick={e => this.doubleClicked(e)}
        style={css}
        role="presentation"
      >
        {this.display}
      </span>
    );
  }
}
