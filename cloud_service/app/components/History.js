import React from "react";
import {Line} from 'react-chartjs-2';
import {Bar} from 'react-chartjs-2';
import Slider from 'react-rangeslider';
// import 'react-rangeslider/lib/index.css';

class History extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      family: this.props.view.family,
      displayName: this.props.view.displayName,
      color: this.props.view.color,
      time: 180,
      data: [],
      average: null,
      median: null,
      high: null,
      low: null
    }

    this.didLoad = this.didLoad.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleOnChangeComplete = this.handleOnChangeComplete.bind(this);
  }

  componentDidMount() {
    fetch(`/telemetry/${this.state.family}/${this.state.displayName}/${this.state.time}`)
      .then((res) => res.json())
        .then((docs) => {
            this.didLoad(docs);
        });
  };

  didLoad(docs) {
    this.setState({data: [] });
    this.setState({data: docs});

    var sorted = docs.sort();
    var average = docs.reduce((sum, val) => { return sum + val }) / docs.length;
    var median = docs[ Math.floor( docs.length / 2) ];

    this.setState({
      average: average,
      median: median,
      high: sorted[docs.length - 1],
      low: sorted[0]
    })
  }

  handleOnChange(value) {
  //  console.log('change complete');
    this.setState({time: value});
  }

  handleOnChangeComplete() {
    fetch(`/telemetry/${this.state.family}/${this.state.displayName}/${this.state.time}`)
      .then((res) => res.json())
        .then((docs) => {
            this.didLoad(docs);
        });
  }

  render() {

    var time = this.state.time;
    var chart = null;

    var options = {
      animation: {
        duration: 600,
        easing: 'linear',
      },
      layout: {
        padding: {
          left: 15,
          right: 3,
        },
      },
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
        position: 'top',
      },
      scales: {
        yAxes: [{
          position: 'right',
          ticks: {
            mirror: false,
           },
          }],
        xAxes: [{
          gridLines: {
            display: false,
            drawTicks: false,
          },
          scaleLabel: {
            display: true,
          },
          ticks: {
            display: false,
          },
        },
        ],
      },
    };

    if(this.state.data.length > 0) {
      var data = {
        labels: this.state.data,
        datasets: [
            {
              fill: true,
              backgroundColor: this.state.color,
              borderWidth: 2,
              lineTension: 0.4,
              pointRadius: 0,
              data: this.state.data
            }
         ]
      }

      chart = (
        <Line data={data}
            options={options}
            width={800}
            height={550}
        />
      )
    }
    return(

      <div className="historyContainer">
        <div className="historyGraph">

        {chart}

        </div>

        <div className="history-info">
          <h3 className="slider-value">Last {time} Minutes</h3>
          <h4>Average</h4>
          <h4>Median</h4>
          <h4>High</h4>
          <h4>Low</h4>
        </div>

        <div className='slider-group'>
          <div className='rangeslider-horizontal'>

            <Slider
              min={5}
              max={1440}
              value={time}
              tooltip={0}
              orientation="horizontal"
              onChange={this.handleOnChange}
              onChangeComplete={this.handleOnChangeComplete}
            />

          </div>

        </div>

      </div>
    )
  }

}

export default History;
