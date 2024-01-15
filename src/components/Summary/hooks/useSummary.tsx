import { useMemo } from "react";
import {
  ITransactions,
  TransactionContext,
} from "../../../contexts/TransactionsContext";
import { useContextSelector } from "use-context-selector";

type Summarytype = {
  income: number;
  outcome: number;
  total: number;
};

export function useSummary() {
  const transactions = useContextSelector(TransactionContext, (context) => {
    return context.transactions;
  });

  function summaryOptionsHandler(
    sumaryAcumulator: Summarytype,
    transaction: ITransactions
  ) {
    const transactionHandler = {
      income: () => {
        sumaryAcumulator.income += transaction.price;
        sumaryAcumulator.total += transaction.price;
        return sumaryAcumulator;
      },
      outcome: () => {
        sumaryAcumulator.outcome += transaction.price;
        sumaryAcumulator.total -= transaction.price;
        return sumaryAcumulator;
      },
    };

    return transactionHandler[transaction.type]();
  }

  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        return summaryOptionsHandler(acc, transaction);
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      }
    );
  }, [transactions]);

  return summary;
}
