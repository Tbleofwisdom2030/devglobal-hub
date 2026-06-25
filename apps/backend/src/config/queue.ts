// Mock queue manager - no Redis required
export const queueManager = {
  getQueue: () => ({
    add: async () => ({ id: 'mock-job' }),
  }),
  addJob: async () => ({ id: 'mock-job' }),
  registerWorker: () => {},
  shutdown: async () => {},
};
