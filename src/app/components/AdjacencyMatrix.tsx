"use client";
import React, { useState, ChangeEvent, useMemo, useCallback } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  useGridApiRef,
} from "@mui/x-data-grid";
import {
  TextField,
  Box,
  Tab,
  Tabs,
  TextareaAutosize,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledDataGridWrapper = styled("div")(({ theme }) => ({
  "& .MuiDataGrid-cell": {
    border: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ddd",
  },
  "& .MuiDataGrid-columnHeader": {
    border: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  '& .MuiDataGrid-cell[data-field="id"]': {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    textAlign: "center",
  },
  "& .MuiDataGrid-cell--textRight": {
    textAlign: "center",
    justifyContent: "center",
  },
}));

const createInitialMatrix = (size: number): (number | null)[][] => {
  return Array.from({ length: size }, (_, rowIndex) =>
    Array.from({ length: size }, (_, colIndex) =>
      rowIndex === colIndex ? 0 : null
    )
  );
};

interface AdjacencyMatrixProps {
  onMatrixChange: (matrix: (number | null)[][]) => void;
  initialSize?: number;
}

const AdjacencyMatrix: React.FC<AdjacencyMatrixProps> = ({
  onMatrixChange,
  initialSize = 7,
}) => {
  const apiRef = useGridApiRef();
  const [size, setSize] = useState<number>(initialSize);
  const [matrix, setMatrix] = useState<(number | null)[][]>(
    createInitialMatrix(initialSize)
  );
  const [tabValue, setTabValue] = useState<number>(0);
  const [textValue, setTextValue] = useState<string>("");
  const [errorOpen, setErrorOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSizeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newSize = parseInt(event.target.value, 10);
      if (newSize > 0) {
        const newMatrix = createInitialMatrix(newSize);
        setSize(newSize);
        setMatrix(newMatrix);
        onMatrixChange(newMatrix);
      }
    },
    [onMatrixChange]
  );

  const handleTabChange = useCallback(
    (_: React.ChangeEvent<{}>, newValue: number) => {
      setTabValue(newValue);
    },
    []
  );

  const handleTextChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setTextValue(event.target.value);
    },
    []
  );

  const parseText = useCallback((text: string): (number | null)[][] => {
    return text
      .split("\n")
      .map((row) =>
        row.split(/[\t,]/).map((value) => (value === "" ? null : Number(value)))
      );
  }, []);

  const applyTextToMatrix = useCallback(() => {
    const parsedMatrix = parseText(textValue);
    if (
      parsedMatrix.length === size &&
      parsedMatrix.every((row) => row.length === size)
    ) {
      setMatrix(parsedMatrix);
      onMatrixChange(parsedMatrix);
    } else {
      setErrorMessage(
        `Los datos proporcionados no coinciden con el tamaño esperado de la matriz ${size}x${size}.`
      );
      setErrorOpen(true);
    }
  }, [textValue, size, parseText, onMatrixChange]);

  const resetMatrix = useCallback(() => {
    const newMatrix = createInitialMatrix(size);
    setMatrix(newMatrix);
    onMatrixChange(newMatrix);
  }, [size, onMatrixChange]);

  const clearText = useCallback(() => {
    setTextValue("");
  }, []);

  const handleCloseError = useCallback((_, reason?: string) => {
    if (reason === "clickaway") return;
    setErrorOpen(false);
  }, []);

  const getVertexLabel = useCallback((index: number): string => {
    return String.fromCharCode(65 + index); // 65 is the ASCII code for 'A'
  }, []);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Vertex",
        width: 90,
        sortable: false,
        disableColumnMenu: true,
        renderHeader: (params) => <strong>{params.colDef.headerName}</strong>,
        renderCell: (params) => <strong>{params.value}</strong>,
      },
      ...Array.from({ length: size }, (_, i) => ({
        field: `vertex${i}`,
        headerName: getVertexLabel(i),
        width: 90,
        type: "number",
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        renderHeader: (params) => <strong>{params.colDef.headerName}</strong>,
      })),
    ],
    [size, getVertexLabel]
  );

  const rows: GridRowsProp = useMemo(
    () =>
      matrix.map((row, i) => {
        const rowData: { id: string; [key: string]: number | string | null } = {
          id: getVertexLabel(i),
        };
        row.forEach((value, j) => {
          rowData[`vertex${j}`] = value === null ? "" : value;
        });
        return rowData;
      }),
    [matrix, getVertexLabel]
  );

  const processRowUpdate = useCallback(
    (newRow) => {
      const rowIndex = Number(newRow.id.charCodeAt(0) - 65);
      const newMatrix = matrix.map((row, i) => {
        if (i !== rowIndex) return row;
        return row.map((val, j) => {
          const field = `vertex${j}`;
          return newRow[field] === "" ? null : Number(newRow[field]);
        });
      });
      setMatrix(newMatrix);
      onMatrixChange(newMatrix);
      return newRow;
    },
    [matrix, onMatrixChange]
  );

  const handleCellKeyDown = useCallback(
    (params, event: React.KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const { field, id } = params;
        const colIndex = columns.findIndex((col) => col.field === field);
        const rowIndex = rows.findIndex((row) => row.id === id);

        let nextColIndex = colIndex + 1;
        let nextRowIndex = rowIndex;

        if (nextColIndex >= columns.length) {
          nextColIndex = 1; // Skip the 'id' column
          nextRowIndex++;
          if (nextRowIndex >= rows.length) {
            nextRowIndex = 0;
          }
        }

        if (columns[nextColIndex].field === "id") {
          nextColIndex++;
        }

        const nextField = columns[nextColIndex].field;
        const nextId = rows[nextRowIndex].id;

        apiRef.current.startCellEditMode({ id: nextId, field: nextField });
        apiRef.current.scrollToIndexes({
          rowIndex: nextRowIndex,
          colIndex: nextColIndex,
        });
      }
    },
    [columns, rows, apiRef]
  );

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
          <StyledDataGridWrapper>
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight
              hideFooter
              apiRef={apiRef}
              processRowUpdate={processRowUpdate}
              onCellKeyDown={handleCellKeyDown}
            />
          </StyledDataGridWrapper>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" color="warning" onClick={resetMatrix}>
              Reiniciar matriz
            </Button>
          </Stack>
        </Box>
      )}
      {tabValue === 1 && (
        <Box sx={{ p: 2 }}>
          <TextareaAutosize
            minRows={10}
            value={textValue}
            onChange={handleTextChange}
            style={{ width: "100%" }}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" onClick={applyTextToMatrix}>
              Importar
            </Button>
            <Button variant="contained" color="secondary" onClick={clearText}>
              Limpiar
            </Button>
          </Stack>
        </Box>
      )}
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdjacencyMatrix;