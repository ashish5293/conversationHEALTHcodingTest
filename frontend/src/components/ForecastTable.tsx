import React from 'react';
import {WeatherForecast} from '../entities/WeatherForecast'
import styles from '../scss/TableStyles.module.scss'
import moment from 'moment'
import {roundTo2DecimalPlaces} from '../utils/RoundOff'
import LoaderComponent from "./LoaderComponent";
interface ForecastTableState {
  forecast: WeatherForecast[] | null
  isLoading: boolean
}


interface ForecastTableProps {
  cityId: number
}

class ForecastTable extends React.Component<ForecastTableProps, ForecastTableState> {

  state: ForecastTableState = {
    forecast: null,
    isLoading: false
  }
  async componentDidMount() {
    await this.fetchForecast()
  }

  async componentDidUpdate(prevProps: { cityId: number }) {
    if (this.props.cityId !== prevProps.cityId) {
      await this.fetchForecast()
    }
  }

  private fetchForecast = async() => {
    try {
      this.setState({isLoading: true})
      const response = await fetch(`/forecast/${this.props.cityId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const jsonResponse = await response.json()
      this.setState({ forecast: jsonResponse as WeatherForecast[]});
    } catch(e) {
      console.log(e)
    } finally {
      this.setState({isLoading: false})
    }

  }
  render() {

    if(!this.state) return null;
    const { forecast, isLoading } = this.state;

    if (!forecast) return null;


    return (
      <div>
        {
          isLoading ? <LoaderComponent /> :
            <div>
              {
                forecast && (
                  <table className={styles.table}>
                    <thead>
                    <tr>
                      <th>Date</th>
                      <th>Temp</th>
                      <th>Min. Temp</th>
                      <th>Max. Temp</th>
                      <th>Wind</th>
                      <th>Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {forecast.map((day) => (
                      <tr key={String(day.date)}>
                        <td>{moment(new Date(day.date)).format("DD MMM, h A")}</td>
                        <td>{roundTo2DecimalPlaces(day.temp - 273.15)} °C</td>
                        <td>{roundTo2DecimalPlaces(day.tempMin - 273.15)} °C</td>
                        <td>{roundTo2DecimalPlaces(day.tempMax - 273.15)} °C</td>
                        <td>{roundTo2DecimalPlaces(day.windSpeed)} m/sec</td>
                        <td>{day.weatherMain}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                )}
            </div>
        }
      </div>

    );
  }
}

export default ForecastTable;
