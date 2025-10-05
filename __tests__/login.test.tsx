import { loginSchema } from '@/constants/schemas/login';
// Previne importar componentes que usan paquetes ESM-only (expo-image)
jest.mock('@/components/common/HeaderHero', () => ({ HeaderHero: () => null }));

// Previne importar el contexto real de autenticación que utiliza fuentes ESM de Firebase
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    isAuthenticating: false,
    authError: null,
    clearError: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe('Login module', () => {
  it('exports a default component', () => {
    const mod = require('../app/(auth)/login');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });

  it('login schema accepts valid shape', () => {
    const ok = loginSchema.safeParse({ email: 'user@test.com', password: 'secret' });
    expect(ok.success).toBe(true);
  });
});
