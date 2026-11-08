"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

interface CartBarProps {
  storePhone?: string;
}

export default function CartBar({ storePhone = "5587999999999" }: CartBarProps) {
  const { itens, quantidadeTotal, valorTotal, alterarQuantidade, removerItem, limparCarrinho } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");
  const [endereco, setEndereco] = useState("");

  if (quantidadeTotal === 0) {
    return null;
  }

  const handleFinalizarPedido = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomeCliente.trim() || !endereco.trim()) {
      alert("Por favor, preencha seu nome e endereço de entrega.");
      return;
    }

    let mensagem = `🛒 *Novo Pedido - ChamaNoZap*\n\n`;
    mensagem += `👤 *Cliente:* ${nomeCliente}\n`;
    mensagem += `📍 *Endereço:* ${endereco}\n\n`;
    mensagem += `📋 *Itens do Pedido:*\n`;

    itens.forEach((item) => {
      const subtotal = Number(item.produto.preco) * item.quantidade;
      mensagem += `- ${item.quantidade}x ${item.produto.nome} (R$ ${Number(item.produto.preco).toFixed(2).replace(".", ",")}) = R$ ${subtotal.toFixed(2).replace(".", ",")}\n`;
    });

    mensagem += `\n💰 *Total Geral:* R$ ${valorTotal.toFixed(2).replace(".", ",")}\n\n`;
    mensagem += `Por favor, confirme meu pedido!`;

    const encodedMessage = encodeURIComponent(mensagem);
    const cleanPhone = storePhone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
    setIsModalOpen(false);
    limparCarrinho();
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-emerald-600 text-white p-4 shadow-2xl z-30 animate-slide-up">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-100 block">
              {quantidadeTotal} {quantidadeTotal === 1 ? "item selecionado" : "itens selecionados"}
            </span>
            <span className="font-extrabold text-lg">
              R$ {valorTotal.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-emerald-700 font-bold px-5 py-2.5 rounded-xl shadow-lg hover:bg-emerald-50 transition active:scale-95 text-sm flex items-center gap-2"
          >
            <span>Ver Carrinho / Finalizar</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-extrabold">
              {quantidadeTotal}
            </span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span>🛒</span> Resumo do Carrinho
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-100 hover:text-white p-1 rounded-full text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-3 divide-y divide-gray-100">
              {itens.map((item) => (
                <div key={item.produto.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{item.produto.nome}</h4>
                    <span className="text-emerald-600 font-semibold text-xs">
                      R$ {Number(item.produto.preco).toFixed(2).replace(".", ",")} un.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() => alterarQuantidade(item.produto.id, -1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-gray-800">{item.quantidade}</span>
                      <button
                        onClick={() => alterarQuantidade(item.produto.id, 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removerItem(item.produto.id)}
                      className="text-red-500 hover:text-red-700 p-1 text-xs font-bold"
                      title="Remover item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
              <div className="flex items-center justify-between text-base font-bold text-gray-900">
                <span>Valor Total:</span>
                <span className="text-emerald-600 text-xl">
                  R$ {valorTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <form onSubmit={handleFinalizarPedido} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    placeholder="Ex: Maria Souza"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Endereço de Entrega *
                  </label>
                  <input
                    type="text"
                    required
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Ex: Av. Paulista, 1000 - Apto 42"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 active:scale-95 text-sm"
                >
                  <span>Enviar Pedido via WhatsApp</span>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
