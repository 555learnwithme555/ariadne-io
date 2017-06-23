import React from "react";
import HistoryGraph from './HistoryGraph'
import {Line} from 'react-chartjs-2';
// //import Slider, { Range } from 'rc-slider';
// // We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// // import Range from 'rc-slider/lib/Range';


class History extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      data: [],
      color: "gold",
      time: 180
    }

    this.setTime = this.setTime.bind(this);
  }

  setTime(newTime) {
    this.setState({time: newTime})
  }

  componentDidMount() {

    var name = this.props.selected.name;
    var field = this.props.selected.field;
    var color = this.props.color;

    fetch('/data/' + this.state.time)
      .then((res) => res.json())
        .then(function(docs) {

            var data = docs.map( function(obj) {
              return obj.telemetry[name][field];
            })

            return data;

        }).then(function(data) {

          this.setState({
            data: data,
            color: color
          });

        }.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    // if(nextProps.color) {
    //   this.setState({chartColor: nextProps.color});
    // }
  }

  render() {

    var data = {
      labels: this.state.data,
      datasets: [
          {
            fill: true,
            backgroundColor: this.state.color,
            borderWidth: 2,
            lineTension: 0.1,
            pointRadius: 0,
            data: this.state.data
          }
       ]
    }

    var options = {
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
      animation: {
        // duration: 100,
        easing: 'linear'
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          position: 'right',
          ticks: {
            // min: this.props.min,
            // max: this.props.max,
            mirror: false,
           },
          }],
        xAxes: [{
          ticks: {
            min: 0,
            max: 0,
          },
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
    }


    return (

      <div> <h3>Historical ***TESTING****</h3>

        <div className="historyContainer">

          <div className="historyGraph">

            <Line data={data}
                options={options}
                width={800}
                height={800}
            />

          </div>

          {/* <div className="sliderContainer">
             <Slider min={0} max={200} defaultValue={3}  />
          </div> */}

        </div>

      </div>
    )
  }

}
export default History;
