const mockLogin = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticating: false,
    authError: null,
    clearError: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('useAuth direct invocation', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls the mocked login function when invoked directly', async () => {
    const { useAuth } = require('@/hooks/useAuth');
    const hook = useAuth();
    await hook.login({ email: 'x@y.com', password: 'pw' });
    expect(mockLogin).toHaveBeenCalledWith({ email: 'x@y.com', password: 'pw' });
  });
});
