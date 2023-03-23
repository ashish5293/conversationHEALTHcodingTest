import { WeatherResponse } from '../../app/entities/WeatherResponse'

export const fixtureFetchCurrentWeatherForCity: WeatherResponse = {
    weatherMain: 'Clouds',
    weatherDescription: 'overcast clouds',
    tempMax: 280.81,
    tempMin: 276.03,
    temp: 278.49,
    windSpeed: 3.6,
    date: new Date('2023-03-23T04:02:07.000Z')
}
