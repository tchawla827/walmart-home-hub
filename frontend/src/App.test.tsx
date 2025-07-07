import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Mock axios to avoid ESM parsing issues during tests
jest.mock('axios', () => ({
  create: () => ({ get: jest.fn(), post: jest.fn() }),
}));

test('renders SmartPantry text somewhere', () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const elements = screen.getAllByText(/SmartPantry/i);
  expect(elements.length).toBeGreaterThan(0);
});
