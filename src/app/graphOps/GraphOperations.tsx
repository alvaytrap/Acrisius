 "use client";
import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Stack,
} from "@mui/material";
import AdjacencyMatrix from "@/app/components/AdjacencyMatrix";

const calculateOrder = (matrix: (number | null)[][]): number => matrix.length;

const calculateSize = (matrix: (number | null)[][]): number =>
  matrix.reduce((sum, row) => sum + row.filter((val) => val !== null && val > 0).length, 0) / 2;

const removeVertex = (matrix: (number | null)[][], vertex: number): (number | null)[][] =>
  matrix.filter((_, i) => i !== vertex).map(row => row.filter((_, j) => j !== vertex));

const contractEdge = (matrix: (number | null)[][], v1: number, v2: number): (number | null)[][] => {
  const newMatrix = matrix.map(row => row.slice());
  for (let i = 0; i < newMatrix.length; i++) {
    if (i !== v1 && i !== v2) {
      newMatrix[v1][i] = (newMatrix[v1][i] || 0) + (newMatrix[v2][i] || 0);
      newMatrix[i][v1] = newMatrix[v1][i];
    }
  }
  newMatrix[v1][v1] = 0;
  return removeVertex(newMatrix, v2);
};

const unionWithCompleteGraph = (matrix: (number | null)[][], k: number): (number | null)[][] => {
  const size = matrix.length;
  const newSize = size + k;
  const newMatrix: (number | null)[][] = Array.from({ length: newSize }, (_, i) =>
    Array.from({ length: newSize }, (_, j) =>
      i < size && j < size ? matrix[i][j] : i >= size && j >= size && i !== j ? 1 : 0
    )
  );
  return newMatrix;
};

// const sumWithCycleGraph = (matrix: (number | null)[][], n: number): (number | null)[][] => {
//   const size = matrix.length;
//   const newSize = size + n;
//   const newMatrix: (number | null)[][] = Array.from({ length: newSize }, (_, i) =>
//     Array.from({ length: newSize }, (_, j) =>
//       i < size && j < size ? matrix[i][j] :
//       i >= size && j >= size ? (Math.abs(i - j) === 1 || Math.abs(i - j) === n - 1 ? 1 : 0) : 0
//     )
//   );
//   return newMatrix;
// };

const cartesianProductWithPathGraph = (matrix: (number | null)[][], t: number): (number | null)[][] => {
  const size = matrix.length;
  const newSize = size * t;
  const newMatrix: (number | null)[][] = Array.from({ length: newSize }, () => Array(newSize).fill(0));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (matrix[i][j] !== null && matrix[i][j]! > 0) {
        for (let k = 0; k < t; k++) {
          newMatrix[i + k * size][j + k * size] = matrix[i][j];
          newMatrix[j + k * size][i + k * size] = matrix[i][j];
        }
      }
    }
  }

  for (let k = 0; k < t; k++) {
    for (let i = 0; i < size; i++) {
      if (k < t - 1) {
        newMatrix[i + k * size][i + (k + 1) * size] = 1;
        newMatrix[i + (k + 1) * size][i + k * size] = 1;
      }
    }
  }

  return newMatrix;
};

const GraphOperations: React.FC = () => {
  const [matrix, setMatrix] = useState<(number | null)[][]>([]);
  const [vertexToRemove, setVertexToRemove] = useState<number>(0);
  const [edgeToContract, setEdgeToContract] = useState<[number, number]>([0, 1]);
  const [kSize, setKSize] = useState<number>(5);
  const [cycleSize, setCycleSize] = useState<number>(5);
  const [pathSize, setPathSize] = useState<number>(5);
  const [results, setResults] = useState<string[]>([]);

  const handleMatrixChange = useCallback((newMatrix: (number | null)[][]) => {
    setMatrix(newMatrix);
    setResults([]);
  }, []);

  const handleRemoveVertex = () => {
    const newMatrix = removeVertex(matrix, vertexToRemove);
    const order = calculateOrder(newMatrix);
    const size = calculateSize(newMatrix);
    setResults([...results, `Eliminar vértice ${vertexToRemove}: Orden = ${order}, Medida = ${size}`]);
  };

  const handleContractEdge = () => {
    const [v1, v2] = edgeToContract;
    const newMatrix = contractEdge(matrix, v1, v2);
    const order = calculateOrder(newMatrix);
    const size = calculateSize(newMatrix);
    setResults([...results, `Contraer arista (${v1}, ${v2}): Orden = ${order}, Medida = ${size}`]);
  };

  const handleUnionWithCompleteGraph = () => {
    const newMatrix = unionWithCompleteGraph(matrix, kSize);
    const order = calculateOrder(newMatrix);
    const size = calculateSize(newMatrix);
    setResults([...results, `Unión con grafo completo K${kSize}: Orden = ${order}, Medida = ${size}`]);
  };

  // const handleUnionWithCycleGraph = () => {
  //   const newMatrix = unionWithCycleGraph(matrix, cycleSize);
  //   const order = calculateOrder(newMatrix);
  //   const size = calculateSize(newMatrix);
  //   setResults([...results, `Unión con ciclo C${cycleSize}: Orden = ${order}, Medida = ${size}`]);
  // };

  const handleCartesianProductWithPathGraph = () => {
    const newMatrix = cartesianProductWithPathGraph(matrix, pathSize);
    const order = calculateOrder(newMatrix);
    const size = calculateSize(newMatrix);
    setResults([...results, `Producto cartesiano con trayecto T${pathSize}: Orden = ${order}, Medida = ${size}`]);
  };

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <AdjacencyMatrix onMatrixChange={handleMatrixChange} initialSize={6} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Orden y Medida del Grafo
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            const order = calculateOrder(matrix);
            const size = calculateSize(matrix);
            setResults([...results, `Orden = ${order}, Medida = ${size}`]);
          }}
          sx={{ mt: 2 }}
        >
          Calcular
        </Button>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Eliminar Vértice
        </Typography>
        <FormControl variant="outlined" sx={{ mt: 2, minWidth: 120 }}>
          <InputLabel>Vértice</InputLabel>
          <Select
            value={vertexToRemove}
            onChange={(e) => setVertexToRemove(Number(e.target.value))}
            label="Vértice"
          >
            {matrix.map((_, i) => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRemoveVertex}
          sx={{ mt: 2 }}
        >
          Eliminar
        </Button>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Contraer Arista
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Vértice 1</InputLabel>
            <Select
              value={edgeToContract[0]}
              onChange={(e) => setEdgeToContract([Number(e.target.value), edgeToContract[1]])}
              label="Vértice 1"
            >
              {matrix.map((_, i) => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel>Vértice 2</InputLabel>
            <Select
              value={edgeToContract[1]}
              onChange={(e) => setEdgeToContract([edgeToContract[0], Number(e.target.value)])}
              label="Vértice 2"
            >
              {matrix.map((_, i) => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Button
          variant="contained"
          color="primary"
          onClick={handleContractEdge}
          sx={{ mt: 2 }}
        >
          Contraer
        </Button>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Unión con Grafo Completo K
        </Typography>
        <TextField
          label="Orden de K"
          type="number"
          value={kSize}
          onChange={(e) => setKSize(Number(e.target.value))}
          variant="outlined"
          sx={{ mt: 2, minWidth: 120 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUnionWithCompleteGraph}
          sx={{ mt: 2 }}
        >
          Unir
        </Button>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Unión con Ciclo Cn
        </Typography>
        <TextField
          label="Orden de Cn"
          type="number"
          value={cycleSize}
          onChange={(e) => setCycleSize(Number(e.target.value))}
          variant="outlined"
          sx={{ mt: 2, minWidth: 120 }}
        />
        <Button
          variant="contained"
          color="primary"
          // onClick={handleUnionWithCycleGraph}
          sx={{ mt: 2 }}
        >
          Unir
        </Button>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Producto Cartesiano con Trayecto Tn
        </Typography>
        <TextField
          label="Orden de Tn"
          type="number"
          value={pathSize}
          onChange={(e) => setPathSize(Number(e.target.value))}
          variant="outlined"
          sx={{ mt: 2, minWidth: 120 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCartesianProductWithPathGraph}
          sx={{ mt: 2 }}
        >
          Producto Cartesiano
        </Button>

        <Typography variant="h6" sx={{ mt: 4 }}>
          Resultados
        </Typography>
        {results.map((result, index) => (
          <Typography key={index} sx={{ mt: 2 }}>
            {result}
          </Typography>
        ))}
      </Box>
    </div>
  );
};

export default GraphOperations;
