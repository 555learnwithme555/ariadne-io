import React from "react";
import Select from './Select';
import HistoryGraph from './HistoryGraph'
import Slider from 'rc-slider/lib/Slider';


class History extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      data: {
        datasets: [],
        options: {},
      },
      chartData: [],
      chartLabels: [],
      chartColors: [],
      time: 180
    }

    this.setTime = this.setTime.bind(this);
    this.addDataset = this.addDataset.bind(this);
  }

  setTime(newTime) {
    this.setState({time: newTime})
  }

  addDataset(data, labels, color) {

    var datasets = {
        labels: labels,
        datasets: [
            {
              fill: true,
              borderWidth: 2,
              backgroundColor: color,
              lineTension: 0.3,
              pointRadius: 0,
              data: [12,11.5,13, 14]
            }
         ]
      };

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
          }
        }
        ]
      }
    };

    var newObj = {
      datasets: datasets,
      options: options
    }

    this.setState( { data: newObj } );
  }


  addData(name, field) {

    fetch('/data/' + this.state.time)
      .then((res) => res.json())
        .then(function(docs) {

          var data = docs.map(function(obj) {
            return obj.telemetry[name][field];
          })

          this.addDataset(data, data, 'blue');

        }.bind(this));
  }

  componentDidMount() {

    var name = this.props.selected.name;
    var field = this.props.selected.field;

    console.log(name, field);

    fetch('/data/' + this.state.time)
      .then((res) => res.json())
        .then(function(docs) {

          console.log(docs);

            var data = docs.map( function(obj) {
              return obj.telemetry[name][field];
            })

            this.addDataset(data, data, 'yellow');

        }.bind(this));
  }

  render() {

    return (

      <div> <h3>Historical ***TESTING****</h3>

        <div className="historyContainer">

          <div className="historySelect">
            <div onClick={ () => this.addData('Solar Controller Monitor', 'current') }>***select***</div>
          </div>


          <HistoryGraph datasets={this.state.data} />


          <div className="sliderContainer">
             <Slider min={0} max={200} defaultValue={3}  />
          </div>

        </div>

      </div>
    )
  }

}
export default History;
