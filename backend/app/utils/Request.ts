import { Logger } from 'pino'
import { Request as RestifyRequest } from 'restify'

export type Request = RestifyRequest & { logger: Logger }
