import React from 'react';
import {CurrentWeather} from '../entities/CurrentWeather'
import {roundTo2DecimalPlaces} from "../utils/RoundOff";
import LoaderComponent from "./LoaderComponent";

interface CurrentWeatherState {
  weather: CurrentWeather | null
  isLoading: boolean
}

interface CurrentWeatherProps {
  cityId: number
}

class CurrentWeatherComponent extends React.Component<CurrentWeatherProps, CurrentWeatherState> {

  state: CurrentWeatherState = {
    weather: null,
    isLoading: true
  }
  async componentDidMount() {
    await this.fetchCurrentWeather()
  }

  async componentDidUpdate(prevProps: { cityId: number }) {
    if (this.props.cityId !== prevProps.cityId) {
      await this.fetchCurrentWeather()
    }
  }

  private fetchCurrentWeather = async() => {
    try {
      this.setState({isLoading: true})
      const response = await fetch(`/current/${this.props.cityId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const jsonResponse = await response.json()
      this.setState({ weather: jsonResponse });
    } catch(e) {
      console.log(e)
    } finally {
      this.setState({isLoading: false})
    }
  }
  render() {
    const { weather, isLoading } = this.state;

    if (!weather) return null;

    const tempInCelsius = weather.temp - 273.15

    return (
      <div>
        {
          isLoading ? (
            <LoaderComponent />
          ) :
            <div>
              <h3>{weather.weatherMain}</h3>
              <p>{weather.weatherDescription}</p>
              <h3>Current Temperature: {roundTo2DecimalPlaces(tempInCelsius)} °C</h3>
              <p>{roundTo2DecimalPlaces(weather.windSpeed)} m/s</p>
            </div>
        }
      </div>
    );
  }
}

export default CurrentWeatherComponent;
