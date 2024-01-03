import { useContext } from "react"
import { ITransactions, TransactionContext } from "../../../contexts/TransactionsContext"

type Summarytype = {
  income: number
  outcome: number
  total: number
}

export function useSummary() {
  const { transactions } = useContext(TransactionContext)

  function summaryOptionsHandler(sumaryAcumulator: Summarytype, transaction: ITransactions) {
    const transactionHandler = {
      income: () => {
        sumaryAcumulator.income += transaction.price
        sumaryAcumulator.total += transaction.price
        return sumaryAcumulator
      },
      outcome: () => {
        sumaryAcumulator.outcome += transaction.price
        sumaryAcumulator.total -= transaction.price
        return sumaryAcumulator
      }
    }

    return transactionHandler[transaction.type]()
  }

  const summary = transactions.reduce(
    (acc, transaction) => {
      return summaryOptionsHandler(acc, transaction)
    },
    {
      income: 0,
      outcome: 0,
      total: 0
    }

  )

  return summary
}