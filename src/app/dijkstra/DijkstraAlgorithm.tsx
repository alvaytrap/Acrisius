import React, { useState, useCallback } from 'react';
import AdjacencyMatrix from '@/app/components/AdjacencyMatrix';
import DijkstraResults from './DijkstraResults';
import { runDijkstra } from './dijkstra'; // Importa la función correctamente
import { Button, Stack, Box, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';

const DijkstraAlgorithm: React.FC = () => {
  const [matrix, setMatrix] = useState<(number | null)[][]>([]);
  const [dijkstraResult, setDijkstraResult] = useState<any>(null);
  const [origin, setOrigin] = useState<string>('A');
  const [destination, setDestination] = useState<string>('A');
  const [size, setSize] = useState<number>(7);
  const [minCost, setMinCost] = useState<number>(Infinity);
  const [minPath, setMinPath] = useState<string>("");

  const getVertexIndex = useCallback((label: string): number => {
    return label.charCodeAt(0) - 65; // 'A' is 65 in ASCII
  }, []);

  const handleRunDijkstra = useCallback(() => {
    const start = getVertexIndex(origin);
    const end = getVertexIndex(destination);
    const result = runDijkstra(matrix, start, end);
    setDijkstraResult(result.steps);
    setMinCost(result.minCost);
    setMinPath(result.minPath);
    setSize(matrix.length);
  }, [matrix, origin, destination, getVertexIndex]);

  const handleMatrixChange = useCallback((newMatrix: (number | null)[][]) => {
    setMatrix(newMatrix);
    setSize(newMatrix.length);
  }, []);

  const renderVertexOptions = useCallback(() => {
    return Array.from({ length: size }, (_, i) => {
      const vertexLabel = String.fromCharCode(65 + i);
      return (
        <MenuItem key={vertexLabel} value={vertexLabel}>
          {vertexLabel}
        </MenuItem>
      );
    });
  }, [size]);

  return (
    <div>
      <AdjacencyMatrix onMatrixChange={handleMatrixChange}/>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Origen</InputLabel>
            <Select
              value={origin}
              onChange={(e) => setOrigin(e.target.value as string)}
              label="Origen"
            >
              {renderVertexOptions()}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Destino</InputLabel>
            <Select
              value={destination}
              onChange={(e) => setDestination(e.target.value as string)}
              label="Destino"
            >
              {renderVertexOptions()}
            </Select>
          </FormControl>
          <Button variant="contained" color="success" onClick={handleRunDijkstra}>
            Ejecutar Dijkstra
          </Button>
        </Stack>
      </Box>
      {dijkstraResult && (
        <div>
          <DijkstraResults dijkstraResult={dijkstraResult} size={size} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Coste mínimo para ir del punto {origin} al punto {destination}: {minCost === Infinity ? 'No path' : minCost}
          </Typography>
          <Typography variant="h6">
            Camino de coste mínimo para ir del punto {origin} al punto {destination}: {minPath}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default DijkstraAlgorithm;
