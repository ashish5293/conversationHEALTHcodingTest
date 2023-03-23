/* eslint sonarjs/cognitive-complexity: 0, sonarjs/no-identical-functions: 0 */
import { expect } from 'chai'
import sinon, { createSandbox, replace, SinonStubbedInstance, stub } from 'sinon'
import { WeatherService } from '../../../app/services/WeatherService'
import { kernel } from '../../../Kernel'
import axios from 'axios'
import { beforeEach } from 'mocha'
import OpenWeatherAPIWeatherResponse from '../../fixtures/OpenWeatherAPIWeatherResponse.json'
import OpenWeatherAPIForecastResponse from '../../fixtures/OpenWeatherAPIForecastResponse.json'
import { fixtureFetchCurrentWeatherForCity } from '../../fixtures/fetchCurrentWeatherForCityFixture'
import { fixtureFetchForecastForCity } from '../../fixtures/fetchForecastForCityFixture'
const sandbox = createSandbox()
let weatherService: WeatherService
let mockAxios: SinonStubbedInstance<any>
const requestId = 'fake-req-id'
describe('WeatherService', () => {
    beforeEach(() => {
        sandbox.restore()
        kernel.unbindAll()
        weatherService = new WeatherService()
    })
    describe('fetchCurrentWeatherForCity', () => {
        beforeEach(() => {
            sinon.restore()
            mockAxios = stub()
            replace(axios, 'get', mockAxios)
        })
        it('should return current weather with required details if correct city id is passed', async () => {
            mockAxios.resetHistory()
            mockAxios.onCall(0).resolves(OpenWeatherAPIWeatherResponse)

            const response = await weatherService.fetchCurrentWeatherForCity(requestId, 6167865)

            expect(mockAxios.callCount).to.equal(1)
            expect(mockAxios.getCall(0).args[0].includes('id=6167865')).to.equal(true)
            expect(response).to.deep.equal(fixtureFetchCurrentWeatherForCity)
        })
        it('should throw error if axios throws error', async () => {
            mockAxios.resetHistory()
            const errMessage = 'Error in Axios'
            mockAxios.onCall(0).rejects(new Error(errMessage))

            let err: Error
            try {
                await weatherService.fetchCurrentWeatherForCity(requestId, 6167865)
            } catch (e) {
                err = e
            }
            expect(mockAxios.callCount).to.equal(1)
            expect(mockAxios.getCall(0).args[0].includes('id=6167865')).to.equal(true)
            expect(err.message).to.equal(errMessage)
        })
    })
    describe('fetchForecastForCity', () => {
        beforeEach(() => {
            sinon.restore()
            mockAxios = stub()
            replace(axios, 'get', mockAxios)
        })
        it('should return forecast with required details if correct city id is passed', async () => {
            mockAxios.resetHistory()
            mockAxios.onCall(0).resolves(OpenWeatherAPIForecastResponse)

            const response = await weatherService.fetchForecastForCity(requestId, 1850147)

            expect(mockAxios.callCount).to.equal(1)
            expect(mockAxios.getCall(0).args[0].includes('id=1850147')).to.equal(true)
            expect(response).to.deep.equal(fixtureFetchForecastForCity)
        })
        it('should throw error if axios throws error', async () => {
            mockAxios.resetHistory()
            const errMessage = 'Error in Axios'
            mockAxios.onCall(0).rejects(new Error(errMessage))

            let err: Error
            try {
                await weatherService.fetchForecastForCity(requestId, 1850147)
            } catch (e) {
                err = e
            }
            expect(mockAxios.callCount).to.equal(1)
            expect(mockAxios.getCall(0).args[0].includes('id=1850147')).to.equal(true)
            expect(err.message).to.equal(errMessage)
        })
    })
})
