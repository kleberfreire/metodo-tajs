import { describe, expect, it,jest } from '@jest/globals';
import Person from '../src/person.js';

const sum = (a, b) => a + b;

describe('#Person Suite', () => {
  describe('#Validate Suite', () => {
    const personFaker = { name: 'Zezin da Silva', cpf: '123.456.789-00' };


    it('#Validate should throw an error if name is missing', () => {
      const mokeInvalidName = { cpf: personFaker.cpf };
      expect(() => Person.validate(mokeInvalidName)).toThrow(new Error('Name is required'));
    });

    it('#Validate should throw an error if cpf is missing', () => {
      const mokeInvalidCpf = { name: personFaker.name };
      expect(() => Person.validate(mokeInvalidCpf)).toThrow(new Error('CPF is required'));
    });

      it('#Validate should not throw an error if person is valid', () => {
      const mokeValidPerson = { name: personFaker.name, cpf: personFaker.cpf };
      expect(() => Person.validate(mokeValidPerson)).not.toThrow();
    });

    it('#Validate should create a person instance', () => {
      const mokeValidPerson = { name: personFaker.name, cpf: personFaker.cpf };
      const personInstance = new Person(mokeValidPerson);

      expect(personInstance).toBeInstanceOf(Person);
    });
    it('#Validate should validate a person', () => {
      const mokeValidPerson = { name: personFaker.name, cpf: personFaker.cpf };
      expect(Person.validate(mokeValidPerson)).toBe(true);
    });
  });

  describe('#Format Suite', () => {
    it('#Format should format a person name and cpf', () => { 
      const personFaker = { name: 'Zezin da Silva', cpf: '123.456.789-00' };
      const formattedPerson = Person.format(personFaker);
      const expected = {
        name: 'Zezin',
        lastName: 'da Silva',
        cpf: '12345678900',
      };
      expect(formattedPerson).toEqual(expected);
    })
  })
  describe('#Save Suite', () => {
    it('#Save should save a person', () => { 
      const personFaker = { name: 'Zezin da Silva', cpf: '123.456.789-00' };
      const personFormatted = Person.format(personFaker);
      const personSaved = Person.save(personFormatted);

      expect(() => Person.process(personFaker)).not.toThrow();
    });
  })

  describe('#Process Suite', () => {
    const validadeSpy = jest.spyOn(Person, Person.validate.name);
    const formatSpy = jest.spyOn(Person, Person.format.name);
    const saveSpy = jest.spyOn(Person, Person.save.name); 

    it('should process is person an validate Person is error', () => { 
      const personFaker = { name: 'Zezin da Silva', cpf: '123.456.789-00' };
      validadeSpy.mockImplementation(() => { 
        throw new Error('validation error')
      });
      formatSpy.mockReturnValue({
        name: 'Zezin',
        lastName: 'da Silva',
        cpf: '12345678900',
      });
      saveSpy.mockReturnValue();

      expect(() => Person.process(personFaker)).toThrow(new Error('validation error'));
    });

    it('should process is person an validate Person is valid but format is error', () => { 
      const personFaker = { name: 'Zezin da Silva', cpf: '123.456.789-00' };
      validadeSpy.mockReturnValue();
      formatSpy.mockImplementation(() => { 
        throw new Error('format error')
      });
      saveSpy.mockReturnValue();

      expect(() => Person.process(personFaker)).toThrow(new Error('format error'));
    });

    it('should process is person an validate Person is valid but format is valid but save is error', () => { 
      const personFaker = { name: 'Zezin da Silva', cpf: '123.456.789-00' };
      validadeSpy.mockReturnValue();
      formatSpy.mockReturnValue({
        name: 'Zezin',
        lastName: 'da Silva',
        cpf: '12345678900',
      });
      saveSpy.mockImplementation(() => { 
        throw new Error('save error')
      });

      expect(() => Person.process(personFaker)).toThrow(new Error('save error'));
    });

    it('should process a valid person', () => { 
      const personFaker = { name: 'Zezin da Silva', cpf: '123.456.789-00' };
      validadeSpy.mockReturnValue();
      formatSpy.mockReturnValue({
        name: 'Zezin',
        lastName: 'da Silva',
        cpf: '12345678900',
      });
      saveSpy.mockReturnValue();

      const result = Person.process(personFaker);
      const expected = 'ok';
      expect(result).toStrictEqual(expected);
    });
  })
});