import { Next, Response } from 'restify'
import { Controller, Get } from 'inversify-restify-utils'
import { injectable, inject, named } from 'inversify'
import { WeatherService } from '../services/WeatherService'
import { ServiceUnavailableError } from 'restify-errors'
import { TYPES } from '../utils/Types'
import { Request } from '../utils/Request'
import { v4 as uuidv4 } from 'uuid'
import { SUPPORTED_CITIES } from '../../SupportedCities'
import { Logger } from 'pino'
import { WeatherResponse } from '../entities/WeatherResponse'

@injectable()
@Controller('/')
export class WeatherController {
    constructor(
        @inject(TYPES.Logger)
        private readonly logger: Logger,
        @inject(TYPES.Service)
        @named(TYPES.WeatherService)
        private readonly weatherService: WeatherService
    ) {}

    @Get('/current/:cityId')
    public async currentWeather(req: Request, res: Response, next: Next): Promise<void> {
        return this.fetchFromWeatherService(
            req,
            res,
            next,
            this.weatherService.fetchCurrentWeatherForCity,
            'currentWeather'
        )
    }

    @Get('/forecast/:cityId')
    public async forecast(req: Request, res: Response, next: Next): Promise<void> {
        return this.fetchFromWeatherService(
            req,
            res,
            next,
            this.weatherService.fetchForecastForCity,
            'forecast'
        )
    }

    @Get('/supportedCities')
    public async getSupportedCities(req: Request, res: Response, next: Next): Promise<void> {
        res.json(200, SUPPORTED_CITIES)
        return next()
    }

    private async fetchFromWeatherService(
        req: Request,
        res: Response,
        next: Next,
        serviceFunction: (
            requestId: string,
            cityId: number
        ) => Promise<WeatherResponse[] | WeatherResponse>,
        tag: string
    ): Promise<void> {
        const requestId = uuidv4()
        try {
            const permittedCities = SUPPORTED_CITIES.map((city) => city.id)
            const valid = this.validateCityId(req, permittedCities)
            const cityId = Number(req.params['cityId'])
            if (!valid) {
                res.json(400, {
                    errors: `Please make sure that the cityId in path is a number and is one of ${permittedCities}`
                })
            } else {
                const response = await serviceFunction(requestId, cityId)
                res.json(200, response)
            }
            this.logger.info({ msg: `Successful ${tag} fetch for cityId ${cityId}`, requestId })
            return next()
        } catch (e) {
            this.logger.error({
                msg: e.message,
                requestId,
                tags: ['controller', 'weather', 'error', tag],
                stack: e.stack,
                error: e
            })
            return next(new ServiceUnavailableError(e))
        }
    }

    private validateCityId(req: Request, cityIds: number[]): boolean {
        try {
            const cityId = Number(req.params['cityId'])
            if (!cityId || Number.isNaN(cityId) || !cityIds.includes(cityId)) {
                return false
            }
        } catch (e) {
            return false
        }
        return true
    }
}
