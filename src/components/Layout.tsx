import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative bg-dark-950">
      {/* Ambient background orbs — these create the "light source" behind glass elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
        <div
          className="absolute rounded-full animate-float"
          style={{
            width: '800px',
            height: '800px',
            top: '-250px',
            left: '-200px',
            background: 'radial-gradient(circle, rgba(185, 28, 28, 0.20) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute rounded-full animate-float-slow"
          style={{
            width: '650px',
            height: '650px',
            bottom: '-150px',
            right: '-100px',
            background: 'radial-gradient(circle, rgba(67, 56, 202, 0.13) 0%, transparent 65%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute rounded-full animate-float-fast"
          style={{
            width: '450px',
            height: '450px',
            top: '45%',
            right: '25%',
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.09) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
}