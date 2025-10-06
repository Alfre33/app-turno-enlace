jest.mock('firebase/firestore', () => {
  return {
    collection: jest.fn(() => ({})),
    query: jest.fn(() => ({})),
    orderBy: jest.fn(() => ({})),
    getDocs: jest.fn(async () => ({
      docs: [
        { id: 'c1', data: () => ({ name: 'Work', color: '#ff0' }) },
      ],
    })),
    onSnapshot: jest.fn((q, onNext) => {
        // llama al callback inmediatamente con datos simulados
        onNext({ docs: [ { id: 'c1', data: () => ({ name: 'Work', color: '#ff0' }) } ] });
      return () => {};
    }),
  };
});

// Simula la biblioteca firebase local para evitar importar expo / secure store durante las pruebas
jest.mock('../src/libs/firebase', () => ({ db: {} }));

import { getCategories, subscribeToCategories } from '../src/services/categoriesService';

describe('categoriesService', () => {
  it('getCategories returns mapped categories', async () => {
    const rows = await getCategories();
    expect(Array.isArray(rows)).toBe(true);
    expect(rows[0]).toHaveProperty('id', 'c1');
    expect(rows[0]).toHaveProperty('name', 'Work');
    expect(rows[0]).toHaveProperty('color', '#ff0');
  });

  it('subscribeToCategories calls onSnapshot and returns unsubscribe', () => {
    const cb = jest.fn();
    const unsub = subscribeToCategories(cb);
    expect(typeof unsub).toBe('function');
  });
});
