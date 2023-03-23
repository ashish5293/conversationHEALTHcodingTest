import { TYPE } from 'inversify-restify-utils'

export const TYPES = {
    Logger: 'Logger',
    Controller: TYPE.Controller,
    WeatherController: 'WeatherController',
    Service: 'Service',
    WeatherService: 'WeatherService',
    Redis: 'Redis',
    RedisAdapter: 'RedisAdapter'
}
