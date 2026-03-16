import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';

export default class Service {
  #filename
  constructor({fileName}) {
    this.#filename = fileName;
    if(!fsSync.existsSync(this.#filename)) {
      fsSync.writeFileSync(this.#filename, '');
    }
  }

  #hashPassword(password) {
    const hash = crypto.createHash('sha256').update(password);
    return hash.digest('hex');
  }



  create({ username, password }) {
    const id = crypto.randomUUID();
    const passwordHash = this.#hashPassword(password);
    const user = { id, username, password: passwordHash, createdAt: new Date().toISOString() };

    const data = JSON.stringify(user).concat('\n');

    fs.appendFile(this.#filename, data);

  }

  async read() {
    try {
      const existingFile = fsSync.existsSync(this.#filename);
      if(!existingFile) {
        return [];
      }
      const lines = (await fs.readFile(this.#filename, 'utf-8')).split('\n').filter(Boolean);
      if(!lines?.length) {
        return [];
      }

      return lines
        .map(line => JSON.parse(line))
        .map(({ password, ...rest }) => rest);
    } catch (error) {
      // console.error('Error reading file:', error);
      return [];
    }
  }
}