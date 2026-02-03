import LeadForm from '@/components/LeadForm';

const testimonials = [
  {
    quote:
      '“Finalmente parei de cruzar NF-e e extratos na mão. Em uma tarde, fechei o mês inteiro.”',
    author: 'Juliana Rocha · Contadora'
  },
  {
    quote:
      '“Com a FiscalVerify, ganhei tempo para orientar meus clientes em vez de revisar planilhas.”',
    author: 'Mateus Oliveira · Escritório Digital'
  },
  {
    quote:
      '“A conciliação virou um processo de minutos. Os alertas evitaram multas no último trimestre.”',
    author: 'Carla Menezes · CFO PME'
  }
];

export default function HomePage() {
  return (
    <>
      <main>
        <section className="hero container">
          <div className="hero__content">
            <span className="hero__eyebrow">FiscalVerify · Lead Magnet</span>
            <h1 className="hero__title">
              Faça upload de extratos e notas fiscais e concilie tudo em minutos.
            </h1>
            <p className="hero__subtitle">
              Elimine as planilhas intermináveis e reduza o fechamento mensal de 40 horas para cerca de 4 horas,
              com uma visão clara e confiável do seu compliance fiscal.
            </p>
            <ul className="benefits">
              <li>Conferidor NF vs Extrato pronto para uso, sem integrações caras.</li>
              <li>Matching inteligente por valor e data, com alertas de inconsistências.</li>
              <li>Classificação automática de receitas e despesas para ganhar escala.</li>
            </ul>
            <a className="cta-button" href="#form-title">
              Quero conferir minhas NF com o Extrato agora
            </a>
          </div>
          <div className="hero__card">
            <h2 className="section-title">O que você recebe</h2>
            <p className="helper-text">
              A planilha “Conferidor NF vs Extrato” organiza seus uploads e revela divergências em segundos.
            </p>
            <ul className="benefits">
              <li>Guia de upload-first para contabilidades digitais.</li>
              <li>Checklist de compliance e prazos fiscais críticos.</li>
              <li>Resumo executivo pronto para compartilhar com clientes.</li>
            </ul>
          </div>
        </section>

        <section className="container social-proof" aria-labelledby="social-proof-title">
          <h2 className="section-title" id="social-proof-title">
            Profissionais que já reduziram a burocracia
          </h2>
          <div className="testimonials">
            {testimonials.map((item) => (
              <article key={item.author} className="testimonial-card">
                <p>{item.quote}</p>
                <strong>{item.author}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="container" aria-labelledby="form-title">
          <LeadForm />
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <strong>FiscalVerify</strong>
          <span>
            Concilie extratos e notas fiscais com segurança, clareza e autonomia. O fiscal não espera: feche o mês
            sem planilhas infinitas.
          </span>
          <div className="footer-links">
            <a href="/politica-de-privacidade">Política de Privacidade</a>
            <a href="mailto:contato@fiscalverify.com.br">contato@fiscalverify.com.br</a>
          </div>
        </div>
      </footer>
    </>
  );
}
