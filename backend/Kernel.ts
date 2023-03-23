import { Container } from 'inversify'
import pino, { Logger } from 'pino'
import 'reflect-metadata'

import { TYPES } from './app/utils/Types'
import { WeatherController } from './app/controllers/WeatherController'
import { WeatherService } from './app/services/WeatherService'

if (!process.env.npm_package_name || !process.env.npm_package_version) {
    /* eslint camelcase: 0 */
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const p = require('../package.json')
    process.env.npm_package_name = p.name
    process.env.npm_package_version = p.version
}

const kernel = new Container()

//bind utils
const loggerEnabled = process.env.NODE_ENV !== 'test'
const logger = pino({ name: process.env.NODE_ENV, level: 'debug', enabled: loggerEnabled })
kernel.bind<Logger>(TYPES.Logger).toConstantValue(logger)

//bind controllers
kernel
    .bind<WeatherController>(TYPES.Controller)
    .to(WeatherController)
    .whenTargetNamed(TYPES.WeatherController)

//bind services
kernel
    .bind<WeatherService>(TYPES.Service)
    .to(WeatherService)
    .inSingletonScope()
    .whenTargetNamed(TYPES.WeatherService)

export { kernel }
