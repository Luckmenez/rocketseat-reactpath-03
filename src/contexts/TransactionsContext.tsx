import { useCallback, useEffect, useState } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

export interface ITransactions {
  id: number;
  category: string;
  createdAt: string;
  description: string;
  price: number;
  type: "income" | "outcome";
}

interface CreateTransactionPayload {
  description: string;
  price: number;
  category: string;
  type: "income" | "outcome";
}

interface TransactionContextType {
  transactions: ITransactions[];
  fetchTransactions: (query?: string) => Promise<void>;
  createNewTransaction: (payload: CreateTransactionPayload) => void;
}

export const TransactionContext = createContext({} as TransactionContextType);

interface TransactionProviderProps {
  children: React.ReactNode;
}

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<ITransactions[]>([]);

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get("transactions", {
      params: {
        _sort: "createdAt",
        _order: "desc",
        q: query,
      },
    });

    setTransactions(response.data);
  }, []);

  const createNewTransaction = useCallback(
    async (payload: CreateTransactionPayload) => {
      const { description, category, price, type } = payload;
      const response = await api.post("transactions", {
        description,
        category,
        price,
        type,
        createdAt: new Date(),
      });

      setTransactions((state) => [response.data, ...state]);
    },
    []
  );

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createNewTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}
