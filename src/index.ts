import express from 'express';
import { CreateUserDto, GetUserParamsDto } from './dto';
import { bodyValidator, paramValidator } from './middleware';

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

app.post('/user', bodyValidator(CreateUserDto), (req, res) => {
  const user = req.validatedBody as CreateUserDto;
  const id = Number(Math.random().toString().slice(3));
  EXAMPLE_DB[id] = { id, ...user };
  res.json(EXAMPLE_DB[id]);
});

app.listen(2951, () => console.log('Listening on port 2951.'));
