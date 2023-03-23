import { TYPE } from 'inversify-restify-utils'
import {WeatherController} from "../controllers/WeatherController";

export const TYPES = {
    Logger: 'Logger',
    Controller: TYPE.Controller,
    WeatherController: 'WeatherController',
    Service: 'Service',
    WeatherService: 'WeatherService',
    Redis: 'Redis',
    RedisAdapter: 'RedisAdapter'
}
