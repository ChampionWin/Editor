import React, { Component } from "react";
import './ShapeHome.css';
class ShapeHome extends Component {
  render() {
    return (
      <div>
        <h2 class={"title"}> You can create shapes you want to draw</h2>
        <div class={"btn-group"}>
          <button>Apple</button>
          <button>Samsung</button>
          <button>Sony</button>
        </div>
      </div>
    );
  }
}

export default ShapeHome;
