export interface Item {
  name: string;
  weight: number;
  value: number;
}

export function knapsack(capacity: number, items: Item[]): { optimal: Item[], alternatives: Item[][] } {
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  // Rellenar la tabla dp
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

  // Recuperar los elementos de la solución óptima
  let res = dp[n][capacity];
  let w = capacity;
  const optimalItems: Item[] = [];

  for (let i = n; i > 0 && res > 0; i--) {
    if (res !== dp[i - 1][w]) {
      optimalItems.push(items[i - 1]);
      res -= items[i - 1].value;
      w -= items[i - 1].weight;
    }
  }

  // Encontrar soluciones subóptimas
  const alternatives: Item[][] = [];
  const generateAlternatives = (currentItems: Item[], startIndex: number) => {
    let totalWeight = currentItems.reduce((acc, item) => acc + item.weight, 0);
    let totalValue = currentItems.reduce((acc, item) => acc + item.value, 0);

    if (totalWeight <= capacity) {
      alternatives.push([...currentItems]);
    }

    for (let i = startIndex; i < n; i++) {
      if (!currentItems.includes(items[i])) {
        currentItems.push(items[i]);
        generateAlternatives(currentItems, i + 1);
        currentItems.pop();
      }
    }
  };

  generateAlternatives([], 0);

  // Filtrar la solución óptima y ordenarlas por valor total de mayor a menor
  const optimalSet = new Set(optimalItems);
  const validAlternatives = alternatives.filter(alternative => {
    const alternativeSet = new Set(alternative);
    return alternative.length > 0 && !alternativeSet.has(optimalItems[0]) && alternative.reduce((acc, item) => acc + item.weight, 0) <= capacity;
  });

  validAlternatives.sort((a, b) => {
    const valueA = a.reduce((acc, item) => acc + item.value, 0);
    const valueB = b.reduce((acc, item) => acc + item.value, 0);
    return valueB - valueA;
  });

  return { optimal: optimalItems, alternatives: validAlternatives.slice(0, 3) };
}
