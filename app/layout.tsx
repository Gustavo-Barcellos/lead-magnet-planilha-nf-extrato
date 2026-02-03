import './globals.css';
import { Inter, Roboto_Mono } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' });

export const metadata: Metadata = {
  title: 'FiscalVerify | Conferidor NF vs Extrato',
  description:
    'Concilie extratos bancários e notas fiscais em minutos e reduza 40 horas de trabalho manual para apenas 4 horas.',
  metadataBase: new URL('https://fiscalverify.com.br')
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
