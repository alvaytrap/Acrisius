"use client";
import React, { useState, useCallback } from "react";
import AdjacencyMatrix from "@/app/components/AdjacencyMatrix";
import FloydResults from "./FloydResults";
import { runFloyd } from "./floyd";
import { Button, Box } from "@mui/material";

const FloydAlgorithm: React.FC = () => {
  const [matrix, setMatrix] = useState<(number | null)[][]>([]);
  const [floydResult, setFloydResult] = useState<any>(null);
  const [initialMatrix, setInitialMatrix] = useState<number[][]>([]);

  const handleRunFloyd = useCallback(() => {
    const adjustedMatrix = matrix.map((row) =>
      row.map((value) =>
        value === null || value === -1 || value === Infinity
          ? Infinity
          : value
      )
    );
    setInitialMatrix(
      adjustedMatrix.map((row) =>
        row.map((value) => (value === Infinity ? -1 : value))
      )
    );
    const result = runFloyd(adjustedMatrix);
    setFloydResult(result.steps);
    console.log(result.steps);
  }, [matrix]);

  const handleMatrixChange = useCallback((newMatrix: (number | null)[][]) => {
    setMatrix(newMatrix);
    setFloydResult(null);
  }, []);

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <AdjacencyMatrix onMatrixChange={handleMatrixChange} initialSize={4}/>
        <Button
          variant="contained"
          color="success"
          onClick={handleRunFloyd}
          sx={{ mt: 4, mb: 4 }}
        >
          Ejecutar Floyd
        </Button>
        {floydResult && (
          <FloydResults
            floydResult={floydResult}
            initialMatrix={initialMatrix}
            isFinal
          />
        )}
      </Box>
    </div>
  );
};

export default FloydAlgorithm;
