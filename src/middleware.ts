import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import type { Request, Response, NextFunction } from 'express';

// Override Express request
declare global {
  namespace Express {
    export interface Request {
      validatedParams: Record<string, any>;
      validatedQuery: Record<string, any>;
      validatedBody: any;
    }
  }
}

export interface IClassMiddlewareOptions {
  whitelist: boolean;
  implicitConversion: boolean;
  // Even if request doesn't satisfy validator, execute request handler
  // Otherwise it will throw a 400 error with a JSON payload
  passOnError: boolean;
}

export function paramValidator<T extends object>(dtoClass: ClassConstructor<T>, options: Partial<IClassMiddlewareOptions> = {}) {
  return createValidatorMiddleware({
    objectGetter: req => req.params,
    objectSetter: (req, dto) => req.validatedParams = dto,
    dtoClass,
    options,
  });
}

export function queryValidator<T extends object>(dtoClass: ClassConstructor<T>, options: Partial<IClassMiddlewareOptions> = {}) {
  return createValidatorMiddleware({
    objectGetter: req => req.query,
    objectSetter: (req, dto) => req.validatedQuery = dto,
    dtoClass,
    options,
  });
}

export function bodyValidator<T extends object>(dtoClass: ClassConstructor<T>, options: Partial<IClassMiddlewareOptions> = {}) {
  return createValidatorMiddleware({
    objectGetter: req => req.body,
    objectSetter: (req, dto) => req.validatedBody = dto,
    dtoClass,
    options,
  });
}

interface ICreateMiddlewareOptions<T> {
  objectGetter: (req: Request) => any;
  objectSetter: (req: Request, dto: T) => void;
  dtoClass: ClassConstructor<T>;
  options: Partial<IClassMiddlewareOptions>;
}

function createValidatorMiddleware<T extends object>({ objectGetter, objectSetter, options, dtoClass }: ICreateMiddlewareOptions<T>) {
  return function (req: Request, res: Response, next: NextFunction) {
    const params = objectGetter(req) ?? {};
    const dto = plainToInstance(dtoClass, params, { exposeUnsetFields: false, enableImplicitConversion: options.implicitConversion });

    validateOrReject(dto, { whitelist: options.whitelist ?? true })
      .then(() => {
        objectSetter(req, dto);
        next();
      })
      .catch(errors => {
        if (options.passOnError) {
          next();
        } else {
          res.status(400).json({ error: true, statusCode: 400, errorCode: 'PARAMS_VALIDATION_ERROR', errors });
        }
      });
  };
}
