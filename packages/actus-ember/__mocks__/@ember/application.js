const mockResolveRegistration = jest.fn(() => ({ environment: "development" }));

const getOwner = jest.fn(() => ({
  resolveRegistration: mockResolveRegistration,
}));

export { mockResolveRegistration, getOwner };
