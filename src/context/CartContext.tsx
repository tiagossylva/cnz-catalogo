"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Produto {
  id: number | string;
  nome: string;
  preco: number;
  descricao?: string;
  categoria?: string;
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

interface CartContextData {
  itens: ItemCarrinho[];
  adicionarItem: (produto: Produto) => void;
  removerItem: (produtoId: number | string) => void;
  alterarQuantidade: (produtoId: number | string, delta: number) => void;
  limparCarrinho: () => void;
  quantidadeTotal: number;
  valorTotal: number;
  // Aliases de compatibilidade
  adicionarProduto: (produto: Produto) => void;
  removerProduto: (produtoId: number | string) => void;
  atualizarQuantidade: (produtoId: number | string, quantidade: number) => void;
}

const CartContext = createContext<CartContextData | undefined>(undefined);

const CART_STORAGE_KEY = "@chamanozap:cart:v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItens(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Erro ao carregar carrinho do localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(itens));
      } catch (error) {
        console.error("Erro ao salvar carrinho no localStorage:", error);
      }
    }
  }, [itens, isInitialized]);

  const adicionarItem = (produto: Produto) => {
    setItens((prevItens) => {
      const indexExistente = prevItens.findIndex((item) => item.produto.id === produto.id);
      if (indexExistente >= 0) {
        const novosItens = [...prevItens];
        novosItens[indexExistente] = {
          ...novosItens[indexExistente],
          quantidade: novosItens[indexExistente].quantidade + 1,
        };
        return novosItens;
      }
      return [...prevItens, { produto, quantidade: 1 }];
    });
  };

  const removerItem = (produtoId: number | string) => {
    setItens((prevItens) => prevItens.filter((item) => item.produto.id !== produtoId));
  };

  const alterarQuantidade = (produtoId: number | string, delta: number) => {
    setItens((prevItens) => {
      return prevItens
        .map((item) => {
          if (item.produto.id === produtoId) {
            const novaQtd = item.quantidade + delta;
            return novaQtd > 0 ? { ...item, quantidade: novaQtd } : null;
          }
          return item;
        })
        .filter(Boolean) as ItemCarrinho[];
    });
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  const atualizarQuantidade = (produtoId: number | string, novaQtd: number) => {
    setItens((prevItens) => {
      const item = prevItens.find((i) => i.produto.id === produtoId);
      if (!item) return prevItens;
      const delta = novaQtd - item.quantidade;
      if (delta === 0) return prevItens;
      return prevItens
        .map((i) => {
          if (i.produto.id === produtoId) {
            return novaQtd > 0 ? { ...i, quantidade: novaQtd } : null;
          }
          return i;
        })
        .filter(Boolean) as ItemCarrinho[];
    });
  };

  const quantidadeTotal = itens.reduce((total, item) => total + item.quantidade, 0);
  const valorTotal = itens.reduce((total, item) => total + Number(item.produto.preco) * item.quantidade, 0);

  return (
    <CartContext.Provider
      value={{
        itens,
        adicionarItem,
        removerItem,
        alterarQuantidade,
        limparCarrinho,
        quantidadeTotal,
        valorTotal,
        adicionarProduto: adicionarItem,
        removerProduto: removerItem,
        atualizarQuantidade,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  }
  return context;
}
