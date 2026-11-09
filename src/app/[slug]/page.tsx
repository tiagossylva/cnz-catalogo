import { notFound } from "next/navigation";
import StoreMenuClient from "./StoreMenuClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StoreMenuPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Pega a URL do backend da variável de ambiente que configuramos na Vercel
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://cnz-backend-a27c.onrender.com";

  // 1. Buscar a loja pela API do Spring Boot
  const storeRes = await fetch(`${apiUrl}/api/lojas/slug/${slug}`, {
    cache: 'no-store' // Garante que não guarda em cache antigo
  });

  if (!storeRes.ok) {
    notFound();
  }
  
  const store = await storeRes.json();

  // 2. Buscar produtos da API do Spring Boot usando o TenantFilter
  const productsRes = await fetch(`${apiUrl}/api/produtos`, {
    headers: {
      "X-Tenant-ID": slug,
    },
    cache: 'no-store'
  });

  const productList = productsRes.ok ? await productsRes.json() : [];

  return <StoreMenuClient store={store} productList={productList} slug={slug} />;
}
