import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';

import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import Service from '../src/service.js';


const sum = (a, b) => a + b;

describe('#create - spies', () => {
  let _service
  const fileName = './test.ndjson';
  const MOCK_HASGED_PASSWORD = 'hashedpassword';
  const MOCK_UUID = 'f94386e2-3a5e-492d-ab13-20f4c8797b12';

  beforeEach(() => {
    jest.spyOn(
      crypto,
      crypto.createHash.name
    ).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(MOCK_HASGED_PASSWORD)
    });

    jest.spyOn(crypto, 'randomUUID').mockReturnValue(MOCK_UUID);

    jest
      .spyOn(
          fs,
          fs.appendFile.name
      )
      .mockResolvedValue()

    _service = new Service({ fileName });
  })

  it('#should call appendFile with right params', async () => {
    const input = { username: 'test', password: '123456' };
    const expectedCreatedAt = new Date().toISOString();

    jest.spyOn(Date.prototype, Date.prototype.toISOString.name).mockReturnValue(expectedCreatedAt);

    await _service.create(input);



    expect(crypto.createHash).toHaveBeenCalledTimes(1);
    expect(crypto.createHash).toHaveBeenNthCalledWith(1,'sha256');

    const hash = crypto.createHash('sha256');

    expect(hash.update).toHaveBeenCalledTimes(1);
    expect(hash.update).toHaveBeenNthCalledWith(1, input.password);
    
    expect(hash.digest).toHaveBeenCalledTimes(1);
    expect(hash.digest).toHaveBeenNthCalledWith(1, 'hex');

    const expected = JSON.stringify({
      id: MOCK_UUID,
      ...input,
      password: MOCK_HASGED_PASSWORD,
      createdAt: expectedCreatedAt
    }).concat('\n');


    expect(fs.appendFile).toHaveBeenCalledWith(fileName,expected)
  })
});