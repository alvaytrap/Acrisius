"use client";
import React, { useState, useCallback } from 'react';
import AdjacencyMatrix from '../components/AdjacencyMatrix';
import GraphResults from './GraphResults';
import { Box, Button } from '@mui/material';

const GraphAnalysis: React.FC = () => {
  const [matrix, setMatrix] = useState<(number | null)[][]>([]);
  const [graphResult, setGraphResult] = useState<number[][] | null>(null);
  const [resetNeighbors, setResetNeighbors] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleMatrixChange = useCallback((newMatrix: (number | null)[][]) => {
    setMatrix(newMatrix);
    setShowResults(false);
    setResetNeighbors(true);
  }, []);

  const calculateResults = () => {
    // Convertimos los valores null a 0 antes de asignar a graphResult
    const adjustedMatrix: number[][] = matrix.map(row => row.map(value => value === null ? 0 : value));
    setGraphResult(adjustedMatrix);
    setShowResults(true);
    setResetNeighbors(false);
  };

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <AdjacencyMatrix onMatrixChange={handleMatrixChange} initialSize={8} labelType='numbers'/>
        <Button variant="contained" color='success' onClick={calculateResults} sx={{ mt: 2, mb: 2 }}>Analizar Matriz</Button>
        {showResults && graphResult && (
          <GraphResults 
            matrix={graphResult} 
            resetNeighbors={resetNeighbors} 
            setResetNeighbors={setResetNeighbors} 
          />
        )}
      </Box>
    </div>
  );
};

export default GraphAnalysis;
