import React, { useState, useCallback, ChangeEvent } from "react";
import { TextField, Box, Tab, Tabs, Button, Stack, Snackbar, Alert } from "@mui/material";
import MatrixDataGrid from "./MatrixDataGrid";
import TextImporter from "./TextImporter";

const createInitialMatrix = (size: number): (number | null)[][] => {
  return Array.from({ length: size }, (_, rowIndex) =>
    Array.from({ length: size }, (_, colIndex) =>
      rowIndex === colIndex ? 0 : null
    )
  );
};

interface AdjacencyMatrixProps {
  onMatrixChange?: (matrix: (number | null)[][]) => void;
  initialSize?: number;
}

const AdjacencyMatrix: React.FC<AdjacencyMatrixProps> = ({ onMatrixChange, initialSize = 7 }) => {
  const [size, setSize] = useState<number>(initialSize);
  const [matrix, setMatrix] = useState<(number | null)[][]>(createInitialMatrix(initialSize));
  const [tabValue, setTabValue] = useState<number>(0);
  const [textValue, setTextValue] = useState<string>("");
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSizeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    if (newSize > 0) {
      const newMatrix = createInitialMatrix(newSize);
      setSize(newSize);
      setMatrix(newMatrix);
      if (onMatrixChange) {
        onMatrixChange(newMatrix);
      }
    }
  }, [onMatrixChange]);

  const handleTabChange = useCallback((_: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const handleCloseError = useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setErrorOpen(false);
  }, []);

  const resetMatrix = useCallback(() => {
    const newMatrix = createInitialMatrix(size);
    setMatrix(newMatrix);
    if (onMatrixChange) {
      onMatrixChange(newMatrix);
    }
  }, [size, onMatrixChange]);

  const handleMatrixChange = useCallback((newMatrix: (number | null)[][]) => {
    setMatrix(newMatrix);
    if (onMatrixChange) {
      onMatrixChange(newMatrix);
    }
  }, [onMatrixChange]);

  return (
    <div style={{ height: "auto", width: "100%" }}>
      <TextField
        label="Número de vértices / Orden"
        type="number"
        value={size}
        onChange={handleSizeChange}
        variant="outlined"
        margin="normal"
      />
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Matriz de adyacencia" />
        <Tab label="Importar TSV,CSV" />
      </Tabs>
      {tabValue === 0 && (
        <Box sx={{ height: "auto", width: "100%" }}>
          <MatrixDataGrid size={size} matrix={matrix} onMatrixChange={handleMatrixChange} />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" color="warning" onClick={resetMatrix}>
              Reiniciar matriz
            </Button>
          </Stack>
        </Box>
      )}
      {tabValue === 1 && (
        <TextImporter
          size={size}
          textValue={textValue}
          setTextValue={setTextValue}
          onMatrixChange={handleMatrixChange}
          setErrorMessage={setErrorMessage}
          setErrorOpen={setErrorOpen}
        />
      )}
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdjacencyMatrix;
