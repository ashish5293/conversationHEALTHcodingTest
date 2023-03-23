import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';
import {roundTo2DecimalPlaces} from "../utils/RoundOff";

const fetchMockedResponse: any = {
  '/supportedCities': [
    {
      id: 6167865,
      name: 'Toronto',
      country: 'CA'
    },
    {
      id: 5128581,
      name: 'New York',
      country: 'US'
    }
  ] as any,
  '/current/6167865': {
    weatherMain: "Freezing rain",
    weatherDescription: "freezing rain with some snow",
    tempMax: 280.81,
    tempMin: 276.12,
    temp: 279.33,
    windSpeed: 1.03,
    date: "2023-03-23T12:53:49.000Z"
  },
  '/forecast/6167865': [
      {
        weatherMain: "Rain",
        weatherDescription: "moderate rain",
        tempMax: 279.1,
        tempMin: 278.84,
        temp: 279.1,
        windSpeed: 2.3,
        date: "2023-03-23T15:00:00.000Z"
      },
      {
        weatherMain: "Rain",
        weatherDescription: "light rain",
        tempMax: 278.86,
        tempMin: 278.67,
        temp: 278.86,
        windSpeed: 3.58,
        date: "2023-03-23T18:00:00.000Z"
      },
      {
        weatherMain: "Clouds",
        weatherDescription: "overcast clouds",
        tempMax: 279.13,
        tempMin: 279.13,
        temp: 279.13,
        windSpeed: 3.93,
        date: "2023-03-23T21:00:00.000Z"
      },
  ]
}
describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    jest.spyOn(global, 'fetch').mockImplementation((url: string) => {
      return {
        json: jest.fn().mockResolvedValue(fetchMockedResponse[url])
      }

    })
  });

  test('renders header, dropdown, and weather components', async () => {
    render(<App />);

    // Check if the header is displayed
    expect(screen.getByText('WEATHER FORECAST')).toBeInTheDocument();

    // Wait for the cities to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('Toronto, CA')).toBeInTheDocument();
      expect(screen.getByText('New York, US')).toBeInTheDocument();
    });

    // Check if the CurrentWeatherComponent is displayed
    expect(screen.getByText('Select CITY')).toBeInTheDocument();
    expect(screen.queryByTestId('city-select')).toBeDefined();

    expect(screen.getByText(fetchMockedResponse['/current/6167865'].weatherMain)).toBeInTheDocument();
    expect(screen.getByText(fetchMockedResponse['/current/6167865'].weatherDescription)).toBeInTheDocument();
    const weather = `Current Temperature: ${roundTo2DecimalPlaces(fetchMockedResponse['/current/6167865'].temp - 273.15)} °C`
    expect(screen.getByText(weather)).toBeInTheDocument()
    const windSpeed = `${roundTo2DecimalPlaces(fetchMockedResponse['/current/6167865'].windSpeed)} m/s`
    expect(screen.getByText(windSpeed)).toBeInTheDocument()

    // Check if the "SEE FORECAST" button is displayed
    expect(screen.getByText('SEE FORECAST')).toBeInTheDocument();
  });

  test('shows and hides the forecast on button click', async () => {
    render(<App />);

    // Wait for the cities to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('Toronto, CA')).toBeInTheDocument();
    });

    // Check that the forecast is initially hidden
    expect(screen.queryByTestId('forecast-table')).toBeNull();

    // Click the "SEE FORECAST" button
    await act( async () => {
      fireEvent.click(screen.getByRole('button'))
    });

    // Check that the forecast is now visible
    expect(screen.queryByTestId('forecast-table')).toBeDefined()

    // Click the "HIDE FORECAST" button
    fireEvent.click(screen.getByText('HIDE FORECAST'));

    // Check that the forecast is hidden again
    expect(screen.queryByTestId('forecast-table')).not.toBeInTheDocument();
  });
});
