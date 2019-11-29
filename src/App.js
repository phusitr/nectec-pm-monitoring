import React from "react";
import { render } from "react-dom";

// Import Highcharts
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more.js";
import solidGauge from "highcharts/modules/solid-gauge.js";

// Import Leaflet map
import { Map, CircleMarker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Import const
import {API_URL} from "./const/APIurl.js";
import {API_URL_STORAGE} from "./const/APIurlstorage.js";
import {TOKEN} from "./const/Token.js";
import {STORAGE} from "./const/Storage.js";

highchartsMore(Highcharts);
solidGauge(Highcharts);

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pm25: [],
      pm10: [],
      pm1: [],
      pm25_storage: [],
      strStatus: '',
      strTime: '',
      lat: 0,
      lon: 0
    };
  }

  async componentDidMount() {
    this.getData();
    this.getStorageData();
    setInterval(this.getData.bind(this),30000);
    setInterval(this.getStorageData.bind(this),30000);
    document.cookie = 'same-site-cookie=foo; SameSite=Lax';
    document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';
  }

   componentWillUnmount() {
  
   }
	
   //-----------------------------------------------------------
   // Fetch data from bigstream [area chart]  pm2.5 only
   //-----------------------------------------------------------
   getStorageData() 
   {
    let url = `${API_URL_STORAGE}`;
    let token = `${TOKEN}`;
    let storage = `${STORAGE}`;
    let y = new Date().getFullYear();
    let m = new Date().getMonth()+1;
    let api_url = url + storage + '.' + y + '.' + m + '/objects?last=120&token=' + token;
    fetch(api_url)
      .then(response => response.json())
      .then(info => {
        let pm25_map = []
	for ( let i=0; i< info.length;i++) {
	  info[i].data.devices.map(data =>
             pm25_map.push({
               y: parseFloat(data.pm25),
	       name: data.time 
             }),
            );
        }

        this.setState({
	   pm25_storage: pm25_map
        });
	console.log (this.state.pm25_storage);
      });
  }


   //-----------------------------------------------------------
   // Fetch data from bigstream [Gauge]  pm2.5 pm1 pm10
   //-----------------------------------------------------------
  getData() 
  {
    let url = `${API_URL}`;
    let token = `${TOKEN}`;
    let storage = `${STORAGE}`;
    let y = new Date().getFullYear();
    let m = new Date().getMonth()+1;
    let api_url = url + storage + '.' + y + '.' + m + '?token=' + token;
    fetch(api_url)
      .then(response => response.json())
      .then(info => {
	console.log (info);
        let pm25_map = []
	let pm10_map  = []
	let pm1_map  = []
	let devStatus = info.data.devices.map(s=>s.status);
	let devUpdated  = info.data.devices.map(s=>s.time);
	let devLat  = parseFloat(info.data.devices.map(s=>s.lat));
	let devLon  = parseFloat(info.data.devices.map(s=>s.lon));

	info.data.devices.map(data =>
          pm25_map.push({
            y: parseFloat(data.pm25)
          }),
        );
	info.data.devices.map(data =>
          pm10_map.push({
            y: parseFloat(data.pm10)
          }),
        );
	info.data.devices.map(data =>
          pm1_map.push({
            y: parseFloat(data.pm1)
          }),
        );
        this.setState({
	   pm25: pm25_map,
	   pm10: pm10_map,
	   pm1: pm1_map,
 	   strStatus: devStatus ,
           strTime: devUpdated,
	   lat: devLat,
	   lon: devLon
        });
      });
  }

  render() 
  {
    // -------------- PM 2.5 Highchart options ----------------
    const options_pm25 = 
    {
      chart: { type: "solidgauge", backgroundColor: "#000000"},
      title: { style: {fontFamily:'DECTERM',fontSize:'13pt',color: '#FFFFFF'},text: 'PM 2.5 (NECTEC Outdoor) µg./m3'},
      yAxis: { 
	 stops: [[0.3, '#55BF3B'], [0.5, '#F6CA33'],[0.9, '#DF5353']],
	 max:100,
	 min:0 ,
         labels: {
            style: {
                fontSize: "13pt",
                color:"#000000",
                fontFamily: "DECTERM"
            }
         }
      },
      series: [
      { 
	  data: this.state.pm25,
          dataLabels: {
          enabled: true,
          style: {
                fontFamily: "AVENIR",
                fontSize: '13pt',
                color:"#1D42E5"
            }
         }
      }
      ]
    };

  // -------------- PM 1.0 Highchart options ----------------
  const options_pm1 =
    {
      chart: { type: "solidgauge", backgroundColor:"#000000"},
      title: {style: {fontFamily:'DECTERM',fontSize:'13pt',color: '#DDDDDD'},text: 'PM 1 (NECTEC Outdoor) µg./m3'},
      yAxis: {
         stops: [[0.3, '#55BF3B'], [0.5, '#F6CA33'],[0.9, '#DF5353']],
	 min:0,
	 max:100,
         labels: {
            style: {
            	fontSize: "13pt",
            	color:"#000000",
            	fontFamily: "DECTERM"
            }
         }
      },
      series: [
      {
        data: this.state.pm1,
        dataLabels: {
           enabled: true,
           style: {
                fontFamily: "AVENIR",
                fontSize: '13pt',
                color:"#1D42E5"
            }
         }
       }
     ]
    };
 
  // -------------- PM 10 Highchart options ----------------
   const options_pm10 =
    {
      chart: { type: "solidgauge", backgroundColor:"#000000"},
      title: {style: {fontFamily:'DECTERM',fontSize:'13pt',color: '#DDDDDD'},text: 'PM 10 (NECTEC Outdoor) µg./m3'},
      yAxis: {
         stops: [[0.3, '#55BF3B'], [0.5, '#F6CA33'],[0.9, '#DF5353']],
	 min:0,
	 max:100,
         labels: {
            style: {
                fontSize: "13pt",
                color:"#000000",
                fontFamily: "DECTERM"
            }
         }
      },
      series: [
      {
         data: this.state.pm10,
	 dataLabels: {
           enabled: true,
           style: {
		fontFamily: "AVENIR",
                fontSize: '13pt',
		color:"#1D42E5"
            }
         }
      }
      ]
    };


  // -------------- PM 2.5 (Line) Highchart options ----------------
  const options_pm25_storage =
    {
      chart: { type: "area", backgroundColor:"#000000"},
      colors: ['#A42121'],
      title: {style: {fontFamily:'DECTERM',fontSize:'13pt',color: '#DDDDDD'},text: 'PM 2.5 (NECTEC Outdoor) µg./m3'},
      xAxis: {
	type: "category",
        labels: {
          style: {
            fontSize: "8pt",
	    color:"#CCCCCC",
            fontFamily: "DECTERM"
          }
        }
      },
      yAxis: {
        labels: {
          style: {
            fontSize: "14pt",
            color:"#CCCCCC",
            fontFamily: "DECTERM"
          }
        }
      },
      plotOptions: {
        area: {
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
      },
      series: [
      {
        data: this.state.pm25_storage,
	name: "PM 2.5"
      }
     ]
    };

  //----- Lat , Lon for display sensor position on map ----//
  const lat = this.state.lat;
  const lon = this.state.lon;

  return (

      <div>
	<div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
	 	 NECTEC PM Monitoring <br/>
	  	Device Status : {this.state.strStatus}, Updated : {this.state.strTime} (Taiwan cloud time)<br/><br/>
	</div>

	<div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <div>
	  	<HighchartsReact highcharts={Highcharts} 
	        containerProps={{ style: { height: "250px",width:"400px",float:"left" } }} 
	  	options={options_pm25} />
	</div>
        <div>
	  	<HighchartsReact highcharts={Highcharts} 
	  	containerProps={{ style: { height: "250px",width:"400px",float:"left" } }}	
	  	options={options_pm1} />
	</div>
        <div>
	  	<HighchartsReact highcharts={Highcharts} 
	  	containerProps={{ style: { height: "250px",width:"400px",float:"left" } }}
	  	options={options_pm10} />
	</div>
	</div>
	<div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
	<div>
                <HighchartsReact highcharts={Highcharts}
                containerProps={{ style: { height: "350px",width:"500px",float:"left" } }}
                options={options_pm25_storage} />
        </div>
        <Map
         	style={{ height: "250px", width: "500px" }}
          	zoom={17} 
          	center={[lat,lon]}>
	  	<TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
	  	<CircleMarker center={[lat,lon]} fillOpacity={0.5} radius={50} stroke={false}  fillColor={'red'}/>
        </Map>
	</div>
     </div>

    );
  }
}

render(<App />, document.getElementById("root"));

export default App;
