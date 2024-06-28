export const getGraphOrder = (matrix: number[][]): number => matrix.length;

export const getGraphMeasure = (matrix: number[][]): number => {
  let measure = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] > 0) {
        measure++;
      }
    }
  }
  return measure / 2;
};

export const getNeighbors = (matrix: number[][], vertex: number): number[] => {
  const neighbors: number[] = [];
  for (let i = 0; i < matrix[vertex - 1].length; i++) {
    if (matrix[vertex - 1][i] > 0) {
      neighbors.push(i + 1);
    }
  }
  return neighbors.sort((a, b) => b - a);
};

export const getDegreeSequence = (matrix: number[][]): number[] => {
  const degrees = matrix.map((row) => row.reduce((sum, val) => sum + (val > 0 ? 1 : 0), 0));
  return degrees.sort((a, b) => b - a);
};

export const getIsolatedVertices = (matrix: number[][]): number[] => {
  const isolated: number[] = [];
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].reduce((sum, val) => sum + val, 0) === 0) {
      isolated.push(i + 1);
    }
  }
  return isolated;
};

export const getConnectedComponents = (matrix: number[][]): number[][] => {
  const visited: boolean[] = new Array(matrix.length).fill(false);
  const components: number[][] = [];

  const dfs = (v: number, component: number[]) => {
    visited[v] = true;
    component.push(v + 1);
    for (let i = 0; i < matrix[v].length; i++) {
      if (matrix[v][i] > 0 && !visited[i]) {
        dfs(i, component);
      }
    }
  };

  for (let i = 0; i < matrix.length; i++) {
    if (!visited[i]) {
      const component: number[] = [];
      dfs(i, component);
      components.push(component);
    }
  }

  return components;
};

export const getComplementMatrix = (matrix: number[][]): number[][] => {
  const complement = matrix.map((row, i) =>
    row.map((val, j) => (i === j ? 0 : val === 0 ? 1 : 0))
  );
  return complement;
};

export const getGraphMeasureComplement = (matrix: number[][]): number => getGraphMeasure(matrix);

export const getConnectedComponentsComplement = (matrix: number[][]): number[][] =>
  getConnectedComponents(matrix);

export const getMatrixWithComponentColors = (matrix: number[][], components: number[][]): string[][] => {
  const colorMatrix = matrix.map(() => new Array(matrix.length).fill(''));

  components.forEach((component, index) => {
    const colorClass = `colored-cell-${index % 10}`;
    component.forEach((vertex) => {
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[vertex - 1][i] > 0 || matrix[i][vertex - 1] > 0) {
          colorMatrix[vertex - 1][i] = colorClass;
          colorMatrix[i][vertex - 1] = colorClass;
        } else if (vertex - 1 === i) {
          colorMatrix[vertex - 1][i] = colorClass;
        }
      }
    });
  });

  return colorMatrix;
};

export const addDegreeRowsAndColumns = (matrix: number[][]): number[][] => {
  const size = matrix.length;
  const newMatrix = matrix.map(row => [...row, row.reduce((sum, val) => sum + (val || 0), 0)]);
  const degreeRow = matrix.reduce((acc, row) => {
    row.forEach((val, colIndex) => {
      acc[colIndex] = (acc[colIndex] || 0) + (val || 0);
    });
    return acc;
  }, new Array(size).fill(0));
  newMatrix.push([...degreeRow, 0]);
  return newMatrix;
};
