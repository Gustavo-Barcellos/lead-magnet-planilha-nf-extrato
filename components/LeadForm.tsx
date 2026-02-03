'use client';

import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function LeadForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('Enviando seus dados...');

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      consent: formData.get('consent') === 'on'
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar.');
      }

      setStatus('success');
      setMessage('Cadastro confirmado! Em instantes você receberá a planilha no seu e-mail.');
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(
        'Não conseguimos enviar agora. Tente novamente ou fale com nosso time no rodapé.'
      );
    }
  };

  return (
    <div className="form-wrapper" aria-live="polite">
      <div>
        <h2 id="form-title">Receba o lead magnet “Conferidor NF vs Extrato”</h2>
        <p className="helper-text">
          Preencha seus dados e tenha acesso imediato à planilha de conciliação inteligente.
        </p>
        <div className="stats" aria-label="Indicadores de impacto">
          <div className="stat">
            <strong>40h → 4h</strong>
            <span>redução de tempo no fechamento</span>
          </div>
          <div className="stat">
            <strong>100%</strong>
            <span>upload-first, sem integrações caras</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} aria-label="Formulário de captura">
        <div>
          <label htmlFor="name">Nome completo</label>
          <input id="name" name="name" type="text" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email">E-mail profissional</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <label>
          <input id="consent" name="consent" type="checkbox" required />
          {' '}Eu concordo em receber comunicações da FiscalVerify.
        </label>
        <div className="form-actions">
          <button className="cta-button" type="submit" disabled={status === 'loading'}>
            Quero conferir minhas NF com o Extrato agora
          </button>
          {status !== 'idle' && (
            <span
              className={`status ${
                status === 'error' ? 'status--error' : status === 'success' ? 'status--success' : ''
              }`}
            >
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
