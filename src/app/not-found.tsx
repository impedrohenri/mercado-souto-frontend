import PublicHeader from "@/components/PublicHeader/PublicHeader";
import Link from "next/link";


// Ilustração do laptop com lupa e ponto de interrogação
// Recriado para parecer um esboço cinza sutil como no original
const NotFoundIllustrationSVG = ({ className }: { className?: string }) => (
  <svg
    width="240"
    height="180"
    viewBox="0 0 240 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Laptop Base */}
    <rect x="20" y="140" width="200" height="12" rx="2" fill="#E5E7EB" />
    <path d="M20 140H220L210 155H30L20 140Z" fill="#D1D5DB" />
    
    {/* Laptop Screen Outline */}
    <rect x="30" y="30" width="180" height="110" rx="4" stroke="#D1D5DB" strokeWidth="2" fill="white"/>
    <path d="M30 130H210" stroke="#E5E7EB" strokeWidth="2"/>

    {/* Magnifying Glass & Question Mark */}
    <g transform="translate(85, 60)" opacity="0.6">
      {/* Glass Circle */}
      <circle cx="35" cy="35" r="30" stroke="#9CA3AF" strokeWidth="2" fill="white" />
      {/* Handle */}
      <path d="M58 58L85 85" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
      {/* Question Mark */}
      <text x="35" y="45" textAnchor="middle" fontFamily="sans-serif" fontSize="40" fontWeight="bold" fill="#9CA3AF">?</text>
    </g>
  </svg>
);


// ---- Componente da Página ----

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <PublicHeader/>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col items-center justify-start pt-16 sm:pt-24 px-4 text-center">
        {/* Ilustração */}
        <div className="mb-8 text-gray-300">
          <NotFoundIllustrationSVG className="w-[200px] h-auto sm:w-60" />
        </div>

        {/* Título de Erro */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Parece que esta página não existe
        </h1>

        {/* Link de Retorno */}
        <Link
          href="/"
          className="text-blue-500 text-sm sm:text-base hover:underline transition-all"
        >
          Ir para a página principal
        </Link>
      </main>
    </div>
  );
}