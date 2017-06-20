import React from "react";
import Test from "./Test";

class Main extends React.Component {

  constructor() {
    super();

    this.state = {
      solar: null
    }

  }

  componentDidMount() {

    var ws = new WebSocket('ws://www.rednightsky.com:8080');

    ws.onmessage = function(event) {

      var msg = JSON.parse(event.data);
      console.log(msg);

      if(msg.name === 'Solar Controller Monitor') {
        this.setState({solar: msg });
      }

    }

  }

  render() {


    return(

      <div>

        <Test key={Date.now()} data={this.state.solar} />

      </div>

    )
  }

}

export default Main;
