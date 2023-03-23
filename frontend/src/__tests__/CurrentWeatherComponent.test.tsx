import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CurrentWeatherComponent from '../../src/components/CurrentWeatherComponent';

describe('CurrentWeatherComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    jest.spyOn(global, 'fetch').mockImplementation(() => {
      return {
        json: jest.fn().mockResolvedValue({
          weatherMain: "Freezing rain",
          weatherDescription: "freezing rain with some snow",
          tempMax: 280.81,
          tempMin: 276.12,
          temp: 279.33,
          windSpeed: 1.03,
          date: "2023-03-23T12:53:49.000Z"
        })
      }

    })
  });

  test('renders loader initially and then displays weather data', async () => {
    const cityId = 1;

    await act(() => render(<CurrentWeatherComponent cityId={cityId}/>))

    // Check if the weather data is displayed correctly
    expect(screen.getByText('Freezing rain')).toBeInTheDocument();
    expect(screen.getByText('freezing rain with some snow')).toBeInTheDocument();
    expect(screen.getByText('Current Temperature: 6.18 °C')).toBeInTheDocument();
    expect(screen.getByText('1.03 m/s')).toBeInTheDocument();
  });
});
