// Mock Redis for development without Redis server
const noop = () => {};
const mockRedis = {
  get: () => Promise.resolve(null),
  set: () => Promise.resolve('OK'),
  del: () => Promise.resolve(1),
  ping: () => Promise.resolve('PONG'),
  on: noop,
  quit: () => Promise.resolve('OK'),
  call: () => Promise.resolve(null),
  status: 'ready',
};

export const redis = mockRedis;

export const redisConnection = {
  getInstance: () => mockRedis,
  getSubscriber: () => mockRedis,
  disconnect: () => Promise.resolve(),
  healthCheck: () => Promise.resolve(true),
};
