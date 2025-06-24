import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "../services/api";

export interface ExchangeRateProps {
  id?: number;
  currency: string;
  exchange_rate: number;
  converted_price: number;
}

export interface ProductProps {
  id?: number;
  name: string;
  price: number | null;
  expiration: string | null;
  exchange_rates: ExchangeRateProps[];
}

interface ProductContextType {
  products: ProductProps[];
  search: string;
  isLoading: boolean;
  initialLoading: boolean;
  total: number;
  fetchProducts: (reset?: boolean) => Promise<void>;
  handleSearchChange: (text: string) => void;
  updateProductInList: (id: number, updatedData: Partial<ProductProps>) => void;
  removeProductFromList: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const limit = 10;

  const fetchProducts = async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const currentPage = reset ? 1 : page;
      const res = await api.get("/products", {
        params: { page: currentPage, limit, search },
      });

      const newProducts: ProductProps[] = res.data.products;

      setProducts((prev) => {
        const combined = reset ? newProducts : [...prev, ...newProducts];
        const unique = Array.from(
          new Map(combined.map((p) => [p.id, p])).values()
        );
        return unique;
      });

      setTotal(res.data.total);
      setPage(reset ? 2 : page + 1);
    } catch (err) {
      console.log("Error fetching products", err);
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  };

  const updateProductInList = (
    id: number,
    updatedData: Partial<ProductProps>
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updatedData } : product
      )
    );
  };

  const removeProductFromList = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        search,
        isLoading,
        initialLoading,
        total,
        fetchProducts,
        handleSearchChange,
        updateProductInList,
        removeProductFromList,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// ✅ Hook com proteção contra uso fora do provider
export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
