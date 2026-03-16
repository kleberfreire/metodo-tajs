import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';

import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import Service from '../src/service.js';


const sum = (a, b) => a + b;

describe('Service Test Suite', () => {
  let _service
  const fileName = './users.ndjson';
  const readFileFunctionName = fs.readFile.name;

  beforeEach(() => {
    _service = new Service({ fileName });
  })

  // describe('#Init Suite', () => {
  //   it('#Init should create a file if it does not exist', () => {
  //     const existsSyncSpy = jest.spyOn(fsSync, 'existsSync').mockReturnValue(false);
  //     const writeFileSyncSpy = jest.spyOn(fsSync, 'writeFileSync').mockImplementation(() => {});

  //     const service = new Service({ fileName: './newfile.ndjson' });

  //     expect(existsSyncSpy).toHaveBeenCalledWith('./newfile.ndjson');
  //     expect(writeFileSyncSpy).toHaveBeenCalledWith('./newfile.ndjson', '');
  //     debugger
  //   });
  // });

  describe('#read Suite', () => {
    it('#read should return an empty array if file is not found', async () => {
      jest.spyOn(fs, readFileFunctionName).mockRejectedValue('File not found');
      
      await expect(_service.read()).resolves.toEqual([]);
      expect(fs.readFile).toHaveBeenCalled();
    });

    it('#read should return an empty array if file is empty', async () => {
      jest.spyOn(fs, readFileFunctionName).mockResolvedValue('');
      const result = await _service.read();
      
      expect(result).toEqual([]);
      expect(fs.readFile).toHaveBeenCalled();
    });

    it('#read should return an array of users without password', async () => {
      const dbData = [
        { id: '123', username: 'test', password: 'hashedpassword', createdAt: new Date().toISOString() },
        { id: '124', username: 'test2', password: 'hashedpassword2', createdAt: new Date().toISOString() },
        { id: '125', username: 'test3', password: 'hashedpassword3', createdAt: new Date().toISOString() },
      ];

      const fileContent = dbData.map(user => JSON.stringify(user)).join('\n');
      jest.spyOn(fs, readFileFunctionName).mockResolvedValue(fileContent);
      const result = await _service.read();
      const expected = dbData.map(({ password, ...rest }) => ({ ...rest }));

      expect(result).toEqual(expected);
      expect(fs.readFile).toHaveBeenCalled();
    })
  })
});