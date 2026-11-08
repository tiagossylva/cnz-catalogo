export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          ChamaNoZap 🍔
        </h1>
        <p className="text-emerald-100 text-lg mb-6">
          Sua plataforma SaaS de delivery automatizado via WhatsApp. Venda mais com inteligência e praticidade.
        </p>
        <div className="space-y-3">
          <a
            href="/lanchonete-do-tiago"
            className="block w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition shadow-lg"
          >
            Ver Cardápio Exemplo (Lanchonete do Tiago)
          </a>
        </div>
      </div>
    </main>
  );
}
