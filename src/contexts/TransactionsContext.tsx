import { createContext, useEffect, useState } from "react";

export interface ITransactions {
  id: number
  category: string
  createdAt: string
  description: string
  price: number
  type: "income" | "outcome"
}

interface TransactionContextType {
  transactions: ITransactions[];
  fetchTransactions: () => Promise<void>
}

export const TransactionContext = createContext({} as TransactionContextType)

interface TransactionProviderProps {
  children: React.ReactNode;
}

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<ITransactions[]>([])

  async function fetchTransactions() {
    const response = await fetch('http://localhost:3333/transactions')
    const data = await response.json()

    setTransactions(data)
  }

  useEffect(() => {
    fetchTransactions()
  }, [])
  return (
    <TransactionContext.Provider value={{
      transactions,
      fetchTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  )
}