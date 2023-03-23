/* eslint sonarjs/cognitive-complexity: 0, sonarjs/no-identical-functions: 0 */
import { expect } from 'chai'
import { createSandbox, SinonStubbedInstance } from 'sinon'
import { kernel } from '../../../Kernel'

import { WeatherService } from '../../../app/services/WeatherService'
import { WeatherController } from '../../../app/controllers/WeatherController'
import { SUPPORTED_CITIES } from '../../../SupportedCities'
import { fixtureFetchCurrentWeatherForCity } from '../../fixtures/fetchCurrentWeatherForCityFixture'
import { fixtureFetchForecastForCity } from '../../fixtures/fetchForecastForCityFixture'

const sandbox = createSandbox()

let weatherService: SinonStubbedInstance<WeatherService>
let weatherController: WeatherController
const logger: any = {
    info: (): any => null,
    error: (): any => null
}
const req: any = {
    query: {},
    params: {},
    logger
}
const res: any = {
    json: Function
}
let next: any
let resJsonStub: any

describe('WeatherController', () => {
    beforeEach(() => {
        sandbox.restore()
        kernel.unbindAll()
        next = sandbox.stub()
        resJsonStub = sandbox.stub(res, 'json' as any)
        sandbox.stub(req.logger, 'error' as any)
        weatherService = sandbox.createStubInstance(WeatherService)
        weatherController = new WeatherController(logger, weatherService)
    })

    describe('currentWeather', () => {
        it('should respond with 400 validation error when cityId is of incorrect format', async () => {
            req.params.cityId = 'someCity'
            await weatherController.currentWeather(req, res, next)
            expect(resJsonStub.callCount).to.equal(1)
            expect(resJsonStub.lastCall.args).to.deep.equal([
                400,
                {
                    errors: `Please make sure that the cityId in path is a number and is one of ${SUPPORTED_CITIES.map(
                        (city) => city.id
                    )}`
                }
            ])
        })
        it('should return a ServiceUnavailable error if the service throws an error', async () => {
            req.params.cityId = '6167865'

            const errMessage = 'Error thrown by service'
            weatherService.fetchCurrentWeatherForCity.rejects(new Error(errMessage))

            await weatherController.currentWeather(req, res, next)
            expect(next.lastCall.args[0].body.code).to.deep.equal('ServiceUnavailable')
        })
        it('should return current weather details when permissible cityId is passed in correct format', async () => {
            req.params.cityId = '6167865'

            weatherService.fetchCurrentWeatherForCity.resolves(fixtureFetchCurrentWeatherForCity)

            await weatherController.currentWeather(req, res, next)
            expect(resJsonStub.callCount).to.equal(1)
            expect(resJsonStub.lastCall.args).to.deep.equal([
                200,
                fixtureFetchCurrentWeatherForCity
            ])
        })
    })

    describe('forecast', () => {
        it('should respond with 400 validation error when cityId is of incorrect format', async () => {
            req.params.cityId = 'someCity'
            await weatherController.forecast(req, res, next)
            expect(resJsonStub.callCount).to.equal(1)
            expect(resJsonStub.lastCall.args).to.deep.equal([
                400,
                {
                    errors: `Please make sure that the cityId in path is a number and is one of ${SUPPORTED_CITIES.map(
                        (city) => city.id
                    )}`
                }
            ])
        })
        it('should return a ServiceUnavailable error if the service throws an error', async () => {
            req.params.cityId = '6167865'

            const errMessage = 'Error thrown by service'
            weatherService.fetchForecastForCity.rejects(new Error(errMessage))

            await weatherController.forecast(req, res, next)
            expect(next.lastCall.args[0].body.code).to.deep.equal('ServiceUnavailable')
        })
        it('should return current weather details when permissible cityId is passed in correct format', async () => {
            req.params.cityId = '6167865'

            weatherService.fetchForecastForCity.resolves(fixtureFetchForecastForCity)

            await weatherController.forecast(req, res, next)
            expect(resJsonStub.callCount).to.equal(1)
            expect(resJsonStub.lastCall.args).to.deep.equal([200, fixtureFetchForecastForCity])
        })
    })

    describe('getSupportedCities', () => {
        it('should respond with supported cities list with their ids, name and country', async () => {
            await weatherController.getSupportedCities(req, res, next)
            expect(resJsonStub.callCount).to.equal(1)
            expect(resJsonStub.lastCall.args).to.deep.equal([200, SUPPORTED_CITIES])
        })
    })
})
