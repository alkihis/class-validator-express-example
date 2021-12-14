import express from 'express';
import { CreateUserDto, GetUserByQueryDto, GetUserParamsDto } from './dto';
import { bodyValidator, paramValidator, queryValidator } from './middleware';

const app = express();

app.use(express.json({ limit: '1mb' }));

const EXAMPLE_DB: any = {};

app.get('/user/:id', paramValidator(GetUserParamsDto), (req, res) => {
  const id = req.validatedParams.id;

  if (id in EXAMPLE_DB) {
    res.json(EXAMPLE_DB[id]);
  } else {
    res.status(404).json({ errorCode: 'NOT_FOUND' });
  }
});

app.get('/user', queryValidator(GetUserByQueryDto), (req, res) => {
  const query = req.validatedQuery as GetUserByQueryDto;
  if (query.password !== 'PASSWORD') {
    return res.status(403).json({ errorCode: 'FORBIDDEN' });
  }

  res.json(Object.values(EXAMPLE_DB).filter((u: any) => {
    if (query.id === u.id) {
      return true;
    }
    if (query.name && u.name.includes(query.name)) {
      return true;
    }
    return false;
  }));
});

app.post('/user', bodyValidator(CreateUserDto), (req, res) => {
  const user = req.validatedBody as CreateUserDto;
  const id = Number(Math.random().toString().slice(3));
  EXAMPLE_DB[id] = { id, ...user };
  res.json(EXAMPLE_DB[id]);
});

app.listen(2951, () => console.log('Listening on port 2951.'));
