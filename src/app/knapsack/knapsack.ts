export interface Item {
  name: string;
  weight: number;
  value: number;
}

export function knapsack(capacity: number, items: Item[]): Item[] {
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (items[i - 1].weight <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - items[i - 1].weight] + items[i - 1].value
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let res = dp[n][capacity];
  let w = capacity;
  const selectedItems: Item[] = [];

  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w]) {
      selectedItems.push(items[i - 1]);
      res -= items[i - 1].value;
      w -= items[i - 1].weight;
    }
  }

  return selectedItems;
}
