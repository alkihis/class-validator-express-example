# class-validator-express-example

## Install

```bash
npm i
```

## Start server

```bash
npm start
```

Server is listening on port 2951.

## How to use in other projects

> Don't forget to enable `"experimentalDecorators": true` and `"emitDecoratorMetadata": true` in your `tsconfig.json`!

1. Install `class-validator` and `class-transformer`
2. Copy/paste `middleware.ts` content in your project, in a dedicated file (or not)
3. Use it as it is used in `index.ts` (request handlers declarations) and `dto.ts` (payload declarations)
