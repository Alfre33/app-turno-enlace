
jest.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: { colors: { bg: '#fff', text: '#000', danger: '#f00', primary: '#06f', textMuted: '#666' } } }),
}));

const mockRegister = jest.fn();

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    register: mockRegister,
    isAuthenticating: false,
    authError: null,
    clearError: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('../components/common/HeaderHero', () => ({ HeaderHero: () => null }));
// Simula el componente Input para evitar dependencias de ESM-only (expo-image)
jest.mock('../components/ui/Input', () => ({
  Input: ({ placeholder, value, onChangeText, error }: any) => {
    const ReactLocal = require('react');
    const { TextInput } = require('react-native');
    return ReactLocal.createElement(TextInput, { placeholder, value, onChangeText, 'data-error': !!error });
  },
}));

describe('Register screen (RTL)', () => {
  beforeEach(() => jest.clearAllMocks());
  it('exports the component and register schema validates expected shape', async () => {
    // asegura que el módulo del componente exporta un componente predeterminado
    const mod = require('../app/(auth)/register');
    expect(mod.default).toBeDefined();

    // Valida el esquema de registro por separado (prueba unitaria para el esquema)
    const { registerSchema } = require('../constants/schemas/register');
    const ok = registerSchema.safeParse({
      fullName: 'Juan Pérez',
      email: 'juan@test.com',
      password: 'Pass1234',
      confirmPassword: 'Pass1234',
      acceptTerms: true,
    });
    expect(ok.success).toBe(true);
  });
});
