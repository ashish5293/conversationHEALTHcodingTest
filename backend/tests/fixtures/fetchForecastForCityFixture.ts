import { WeatherResponse } from '../../app/entities/WeatherResponse'

export const fixtureFetchForecastForCity: WeatherResponse[] = [
    {
        weatherMain: 'Rain',
        weatherDescription: 'moderate rain',
        tempMax: 289.83,
        tempMin: 289.64,
        temp: 289.83,
        windSpeed: 3.98,
        date: new Date('2023-03-23T06:00:00.000Z')
    },
    {
        weatherMain: 'Rain',
        weatherDescription: 'moderate rain',
        tempMax: 289.6,
        tempMin: 289.43,
        temp: 289.6,
        windSpeed: 4.74,
        date: new Date('2023-03-23T09:00:00.000Z')
    },
    {
        weatherMain: 'Rain',
        weatherDescription: 'light rain',
        tempMax: 290.38,
        tempMin: 290.38,
        temp: 290.38,
        windSpeed: 8.4,
        date: new Date('2023-03-23T12:00:00.000Z')
    },
    {
        weatherMain: 'Rain',
        weatherDescription: 'light rain',
        tempMax: 290.8,
        tempMin: 290.8,
        temp: 290.8,
        windSpeed: 7.78,
        date: new Date('2023-03-23T15:00:00.000Z')
    },
    {
        weatherMain: 'Clouds',
        weatherDescription: 'overcast clouds',
        tempMax: 290.95,
        tempMin: 290.95,
        temp: 290.95,
        windSpeed: 6.18,
        date: new Date('2023-03-23T18:00:00.000Z')
    },
    {
        weatherMain: 'Clouds',
        weatherDescription: 'broken clouds',
        tempMax: 289.48,
        tempMin: 289.48,
        temp: 289.48,
        windSpeed: 1.78,
        date: new Date('2023-03-23T21:00:00.000Z')
    }
]
