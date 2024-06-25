export const runFloyd = (matrix: (number | null | any)[][]) => {
  const size = matrix.length;
  const distances = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => {
      if (matrix[i][j] === null || matrix[i][j] === -1 || isNaN(matrix[i][j])) {
        return Infinity;
      } else if (matrix[i][j] === 0 && i !== j) {
        return Infinity;
      } else {
        return matrix[i][j]!;
      }
    })
  );

  const pathMatrix = Array.from({ length: size }, (_, i) =>
    Array.from({ length: size }, (_, j) => (distances[i][j] !== Infinity ? j : null))
  );

  const steps = [];

  for (let k = 0; k < size; k++) {
    const newDistances = distances.map((row, i) =>
      row.map((dist, j) => {
        const newDist = distances[i][k] + distances[k][j];
        if (newDist < dist) {
          pathMatrix[i][j] = pathMatrix[i][k];
          return newDist;
        }
        return dist;
      })
    );
    steps.push({ distances: JSON.parse(JSON.stringify(newDistances)), pivot: k, pathMatrix: JSON.parse(JSON.stringify(pathMatrix)) });
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        distances[i][j] = newDistances[i][j];
      }
    }
  }

  return { steps, finalDistances: distances };
};
