import { create, login } from './usersService.js';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const name = await rl.question('Enter name: ');
const password = await rl.question('Enter password: ');

const user = await login({ name, password });

if (user.name === 'admin') {
  let ended = false;
  do {
    await create({
      name: await rl.question('Enter user name: '),
      password: await rl.question('Enter user password: '),
      bio: await rl.question('Enter user bio: '),
    });

    const isEnd = await rl.question('Next? ');

    if (isEnd === 'n') {
      ended = true;
    }
  } while (!ended);
} else {
    console.log(`Your bio: ${user.bio}`);
}

rl.close();
