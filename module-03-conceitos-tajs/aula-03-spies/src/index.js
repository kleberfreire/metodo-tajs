import Service from "./service.js";

const data = { 
  username: `test-${Date.now()}`, 
  password: '1234' 
};

const service = new Service({ fileName: './users.ndjson' });

await service.create(data);

const users = await service.read();
console.log('Users:', users);