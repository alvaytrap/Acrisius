export const runDijkstra = (matrix: (number | null)[][], start: number, end: number) => {
  const size = matrix.length;
  const distances = Array(size).fill(Infinity);
  const visited = Array(size).fill(false);
  const previous = Array(size).fill(-1);
  const steps: { distances: number[], pivot: number }[] = [];

  distances[start] = 0;

  for (let i = 0; i < size - 1; i++) {
    let minDist = Infinity;
    let minIndex = -1;

    for (let j = 0; j < size; j++) {
      if (!visited[j] && distances[j] < minDist) {
        minDist = distances[j];
        minIndex = j;
      }
    }

    if (minIndex === -1) break;

    visited[minIndex] = true;
    steps.push({ distances: [...distances], pivot: minIndex });

    for (let j = 0; j < size; j++) {
      if (!visited[j] && matrix[minIndex][j] !== null && distances[minIndex] + matrix[minIndex][j]! < distances[j]) {
        distances[j] = distances[minIndex] + matrix[minIndex][j]!;
        previous[j] = minIndex;
      }
    }
  }

  // Set the last step
  let lastMinDist = Infinity;
  let lastMinIndex = -1;

  for (let j = 0; j < size; j++) {
    if (!visited[j] && distances[j] < lastMinDist) {
      lastMinDist = distances[j];
      lastMinIndex = j;
    }
  }
  if (lastMinIndex !== -1) {
    steps.push({ distances: [...distances], pivot: lastMinIndex });
  }

  // Set minimum cost and path
  const minCost = distances[end];

  let path = [];
  for (let at = end; at !== -1; at = previous[at]) {
    path.push(String.fromCharCode(65 + at));
  }
  path.reverse();

  return { steps, minCost, minPath: path.join('') };
};