class Person {
  static validate(person) {
    if (!person.name) {
      throw new Error('Name is required');
    }
    if (!person.cpf) {
      throw new Error('CPF is required');
    }
    return true;
  }

  static format(person) {
    const [name, ...lastName] = person.name.split(' ');

    return {
      cpf: person.cpf.replace(/[\.\-]/g, ''),
      name: name,
      lastName: lastName.join(' '),
    };
  }

  static save(person) {
    const isValid = ['name', 'lastName', 'cpf'].every((prop) => person[prop]);
    if(!isValid) {
      throw new Error(`can not save invalid person: ${JSON.stringify(person)}`);
    }
    console.log('Person saved!');
    
  }

  static process(person) {
    this.validate(person);
    const personFormatted = this.format(person);
    this.save(personFormatted);
    return 'ok';
  }
}

Person.process({
  name: 'Zezin da Silva ',
  cpf: '123.456.789-00',
});
export default Person;
