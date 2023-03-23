import { injectable } from 'inversify'
import axios from 'axios'
import { WeatherResponse } from '../entities/WeatherResponse'

@injectable()
export class WeatherService {
    public async fetchCurrentWeatherForCity(
        requestId: string,
        cityId: number
    ): Promise<WeatherResponse> {
        const requestUrl = `${process.env.OPEN_WEATHER_API_URL}/weather?id=${cityId}&appid=${process.env.OPEN_WEATHER_API_KEY}`
        const response: any = await axios.get(requestUrl)
        return WeatherService.createWeatherResponse(response.data)
    }

    public async fetchForecastForCity(
        requestId: string,
        cityId: number
    ): Promise<WeatherResponse[]> {
        const requestUrl = `${process.env.OPEN_WEATHER_API_URL}/forecast?id=${cityId}&appid=${process.env.OPEN_WEATHER_API_KEY}`
        const response = await axios.get(requestUrl)

        const forecast: WeatherResponse[] = []
        response.data.list.forEach((weather: any) =>
            forecast.push(WeatherService.createWeatherResponse(weather))
        )

        return forecast
    }

    private static createWeatherResponse(openWeatherApiObject: any): WeatherResponse {
        return {
            weatherMain: openWeatherApiObject.weather[0].main,
            weatherDescription: openWeatherApiObject.weather[0].description,
            tempMax: Number(openWeatherApiObject.main.temp_max),
            tempMin: Number(openWeatherApiObject.main.temp_min),
            temp: Number(openWeatherApiObject.main.temp),
            windSpeed: Number(openWeatherApiObject.wind.speed),
            date: new Date(Number(openWeatherApiObject.dt) * 1000)
        }
    }
}
