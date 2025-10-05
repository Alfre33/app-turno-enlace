jest.mock('firebase/firestore', () => {
  function Timestamp(value: any) {
    this._d = value;
  }
  Timestamp.fromDate = (d: Date) => new Timestamp(d);
  Timestamp.prototype.toDate = function () { return this._d; };
  return {
    collection: jest.fn(() => ({})),
    query: jest.fn(() => ({})),
    orderBy: jest.fn(() => ({})),
    getDocs: jest.fn(async () => ({
      docs: [
        { id: 'a1', data: () => ({ title: 'Dentist', date: Timestamp.fromDate(new Date()), notes: 'Check', categoryId: 'c1' }) },
      ],
    })),
    onSnapshot: jest.fn((q, onNext) => {
      onNext({ docs: [ { id: 'a1', data: () => ({ title: 'Dentist', date: Timestamp.fromDate(new Date()), notes: 'Check', categoryId: 'c1' }) } ] });
      return () => {};
    }),
    Timestamp,
  };
});

// Simula la biblioteca firebase local para evitar importar expo / secure store durante las pruebas
jest.mock('../src/libs/firebase', () => ({ db: {} }));

import { getAppointments, subscribeToAppointments } from '../src/services/appointmentsService';

describe('appointmentsService', () => {
  it('getAppointments returns mapped appointments', async () => {
    const rows = await getAppointments();
    expect(Array.isArray(rows)).toBe(true);
    expect(rows[0]).toHaveProperty('id', 'a1');
    expect(rows[0]).toHaveProperty('title', 'Dentist');
  });

  it('subscribeToAppointments returns unsubscribe', () => {
    const cb = jest.fn();
    const unsub = subscribeToAppointments(cb);
    expect(typeof unsub).toBe('function');
  });
});
