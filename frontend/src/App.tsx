import React from 'react';
import './App.css';
import CurrentWeatherComponent from "./components/CurrentWeatherComponent";
import ForecastTable from "./components/ForecastTable";
import {City} from "./entities/City";


interface AppState {
  selectedCityId: number
  showForecast: boolean
  cities: City[]
}

export default class App extends React.Component<{}, AppState> {

  state: AppState = {
    selectedCityId: 6167865,
    showForecast: false,
    cities: []
  };

  async componentDidMount() {
    await this.fetchSupportedCities()
  }
  private handleShowForecast = () => {
      this.setState({showForecast: !this.state.showForecast})
  };

  private fetchSupportedCities = async() => {
    try {
      const response = await fetch(`/supportedCities`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const jsonResponse = await response.json()
      this.setState({ cities: jsonResponse });
    } catch(e) {
      console.log(e)
    }
  }

  render() {
    const { selectedCityId, showForecast, cities } = this.state;

    return (
      <div>
        <h1>WEATHER FORECAST</h1>
        <label htmlFor="city-select">City:</label>
        <select
          id="city-select"
          value={selectedCityId}
          onChange={(e) => this.setState({ selectedCityId: Number(e.target.value) })}
        >
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name},&nbsp;{city.country}
            </option>
          ))}
        </select>

        <CurrentWeatherComponent cityId={selectedCityId} />

        <button onClick={this.handleShowForecast}>{showForecast? 'HIDE FORECAST' : 'SEE FORECAST'}</button>
        {
          showForecast && <ForecastTable cityId={selectedCityId}/>
        }
      </div>
    );
  }
}
