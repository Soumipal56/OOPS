import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../screens/Login';

// Mock framer-motion to avoid animation issues in test
vi.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, onMouseEnter, onClick, ...props }) => (
      <button onMouseEnter={onMouseEnter} onClick={onClick} {...props}>{children}</button>
    ),
  },
  useAnimation: () => ({ start: vi.fn() }),
  AnimatePresence: ({ children }) => children,
}));

const renderLogin = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe('🔐 Login Screen Tests', () => {
  it('renders the OOPS title', () => {
    renderLogin();
    expect(screen.getByText('OOPS')).toBeInTheDocument();
  });

  it('renders the email input', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('youresoalone@gmail.com')).toBeInTheDocument();
  });

  it('renders the gender dropdown', () => {
    renderLogin();
    expect(screen.getByText('Boy (Show me girls)')).toBeInTheDocument();
    expect(screen.getByText('Girl (Show me boys)')).toBeInTheDocument();
  });

  it('renders ENTER THE VOID button', () => {
    renderLogin();
    expect(screen.getByText('ENTER THE VOID →')).toBeInTheDocument();
  });

  it('shows password validation rules', () => {
    renderLogin();
    expect(screen.getByText(/No letter 'e'/)).toBeInTheDocument();
    expect(screen.getByText(/childhood nickname/)).toBeInTheDocument();
    expect(screen.getByText(/predict the weather/)).toBeInTheDocument();
  });

  it('shows rules as red (failing) initially with accent-pink color', () => {
    renderLogin();
    const failingRules = document.querySelectorAll('p');
    const pinkRules = Array.from(failingRules).filter(r =>
      r.style.color === 'var(--accent-pink)' && r.textContent.includes('✕')
    );
    expect(pinkRules.length).toBeGreaterThan(0);
  });

  it('saves gender to localStorage when dropdown changes', () => {
    renderLogin();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'girl' } });
    expect(localStorage.getItem('userGender')).toBe('girl');
  });

  it('saves gender "boy" when selecting boy', () => {
    renderLogin();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'boy' } });
    expect(localStorage.getItem('userGender')).toBe('boy');
  });

  it('typing in email field updates value', () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('youresoalone@gmail.com');
    fireEvent.change(emailInput, { target: { value: 'test@oops.com' } });
    expect(emailInput.value).toBe('test@oops.com');
  });

  it('typing in password field updates value', () => {
    renderLogin();
    const passInput = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passInput, { target: { value: 'JohnSunny123' } });
    expect(passInput.value).toBe('JohnSunny123');
  });
});
