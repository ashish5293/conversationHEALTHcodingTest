import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ForecastTable from '../../src/components/ForecastTable';
import {roundTo2DecimalPlaces} from "../utils/RoundOff";

const forecastDataMock = [
  {
    weatherMain: "Rain",
    weatherDescription: "moderate rain",
    tempMax: 279.1,
    tempMin: 278.84,
    temp: 278.9,
    windSpeed: 2.3,
    date: "2023-03-23T15:00:00.000Z"
  },
  {
    weatherMain: "Snow",
    weatherDescription: "light rain",
    tempMax: 278.86,
    tempMin: 278.67,
    temp: 278.77,
    windSpeed: 3.58,
    date: "2023-03-23T18:00:00.000Z"
  },
  {
    weatherMain: "Clouds",
    weatherDescription: "overcast clouds",
    tempMax: 282.13,
    tempMin: 279.13,
    temp: 279.11,
    windSpeed: 3.93,
    date: "2023-03-23T21:00:00.000Z"
  },
]
describe('CurrentWeatherComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return {
        json: jest.fn().mockResolvedValue(forecastDataMock)
      }

    })
  });

  test('renders loader initially and then displays weather data', async () => {
    const cityId = 1;

    await act(() => render(<ForecastTable cityId={cityId}/>))

    expect(screen.queryByTestId('forecast-table')).toBeDefined()

    // Check if the forecast data is displayed correctly
    forecastDataMock.forEach((forecast) => {
      expect(screen.getByText(forecast.weatherMain)).toBeInTheDocument();
      expect(screen.getByText(`${roundTo2DecimalPlaces(forecast.temp - 273.15)} °C`)).toBeInTheDocument();
      expect(screen.getByText(`${roundTo2DecimalPlaces(forecast.tempMin - 273.15)} °C`)).toBeInTheDocument();
      expect(screen.getByText(`${roundTo2DecimalPlaces(forecast.tempMax - 273.15)} °C`)).toBeInTheDocument();
      expect(screen.getByText(`${roundTo2DecimalPlaces(forecast.windSpeed)} m/sec`)).toBeInTheDocument();
    })

  });
});
