import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeadForm from '../components/LeadForm';

describe('LeadForm', () => {
  it('renders fields and submits payload', async () => {
    const user = userEvent.setup();
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as typeof fetch;

    render(<LeadForm />);

    await user.type(screen.getByLabelText(/nome completo/i), 'Ana Paula');
    await user.type(screen.getByLabelText(/e-mail profissional/i), 'ana@empresa.com');
    await user.click(screen.getByLabelText(/eu concordo/i));

    await user.click(
      screen.getByRole('button', { name: /quero conferir minhas nf com o extrato agora/i })
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Ana Paula',
          email: 'ana@empresa.com',
          consent: true
        })
      });
    });

    expect(
      screen.getByText(/cadastro confirmado/i)
    ).toBeInTheDocument();
  });
});
