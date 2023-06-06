import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { hash, genSalt, compare } from 'bcrypt';
import { v4 as uuid } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = path.resolve(__dirname, './users.json');

const SALT = await genSalt(10);

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const create = async body => {
  if (!passwordRegex.test(body.password)) {
    console.log('password is weak');
    return;
  }
  const users = JSON.parse(await fs.readFile(storage, 'utf-8'));

  if (users.find(item => item.name === body.name)) {
    console.log('User already here!');
    return;
  }

  const password = await hash(body.password, SALT);

  const user = {
    ...body,
    id: uuid(),
    password,
  };

  await fs.writeFile(storage, JSON.stringify([user, ...users]), 'utf-8');
  console.log('User created');
};

export const login = async body => {
  const users = JSON.parse(await fs.readFile(storage, 'utf-8'));

  const user = users.find(user => user.name === body.name);

  if (!user || !(await compare(body.password, user.password))) {
    console.log('Login error');
    return;
  }

  return user;
};
