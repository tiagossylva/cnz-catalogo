import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StoreMenuPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Buscar a loja pelo slug
  const { data: store, error: storeError } = await supabase
    .from("lojas")
    .select("*")
    .eq("slug", slug)
    .single();

  if (storeError || !store) {
    notFound();
  }

  // 2. Buscar produtos ativos da loja usando o slug como tenant_id
  const { data: products } = await supabase
    .from("produtos")
    .select("*")
    .eq("tenant_id", slug)
    .eq("ativo", true);

  const productList = products || [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      {/* Cabeçalho da Loja */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-wide">{store.nome}</h1>
            <p className="text-emerald-100 text-xs flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
              Aberto agora • Pedidos via WhatsApp
            </p>
          </div>
          <div className="bg-emerald-700 text-xs font-semibold px-3 py-1 rounded-full shadow-inner">
            Delivery 🛵
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-md mx-auto px-4 pt-6">
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 shadow-sm">
          <p className="font-medium">👋 Olá! Escolha seus itens abaixo:</p>
          <p className="text-xs text-emerald-600 mt-1">
            Ao adicionar itens, você poderá finalizar seu pedido diretamente pelo WhatsApp.
          </p>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
          <span>Cardápio</span>
          <span className="text-xs text-gray-500 font-normal">{productList.length} itens disponíveis</span>
        </h2>

        {/* Grid / Lista de Produtos */}
        {productList.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
            <p>Nenhum produto cadastrado no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {productList.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition"
              >
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-900 text-base">{product.nome}</h3>
                      {product.categoria && (
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide">
                          {product.categoria}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {product.descricao || "Sem descrição disponível."}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="font-extrabold text-emerald-600 text-base">
                      R$ {Number(product.preco).toFixed(2).replace(".", ",")}
                    </span>
                    <button
                      onClick={() => alert(`Item "${product.nome}" adicionado!`)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-4 rounded-xl shadow transition flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Adicionar</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Carrinho / Ação Fixa no Rodapé */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 shadow-lg z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 block">Carrinho vazio</span>
            <span className="font-bold text-gray-800 text-sm">Nenhum item selecionado</span>
          </div>
          <button
            onClick={() => alert("Seu carrinho está vazio!")}
            className="bg-gray-200 text-gray-400 font-semibold px-5 py-2.5 rounded-xl text-sm cursor-not-allowed"
            disabled
          >
            Finalizar Pedido 🛒
          </button>
        </div>
      </div>
    </div>
  );
}
