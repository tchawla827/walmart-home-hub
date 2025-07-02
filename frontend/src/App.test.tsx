import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SmartPantry text somewhere', () => {
  render(<App />);
  const elements = screen.getAllByText(/SmartPantry/i);
  expect(elements.length).toBeGreaterThan(0);
});
