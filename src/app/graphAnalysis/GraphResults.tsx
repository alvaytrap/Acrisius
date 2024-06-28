import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import {
  getGraphOrder,
  getGraphMeasure,
  getNeighbors,
  getDegreeSequence,
  getIsolatedVertices,
  getConnectedComponents,
  getComplementMatrix,
  getGraphMeasureComplement,
  getConnectedComponentsComplement,
  getMatrixWithComponentColors,
  addDegreeRowsAndColumns,
} from "./graphUtils";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-cell": {
    border: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 8px", // Reducir el padding para hacer las celdas más pequeñas
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
    fontWeight: "bold",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: "bold",
  },
  "& .MuiDataGrid-columnHeaderTitleContainer": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  '& .MuiDataGrid-cell[data-field="vertex"]': {
    fontWeight: "bold",
  },
  "& .degree-cell, & .last-row-cell": {
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
  },
  "& .colored-cell-0": {
    backgroundColor: "#FFC0CB",
  },
  "& .colored-cell-1": {
    backgroundColor: "#ADD8E6",
  },
  "& .colored-cell-2": {
    backgroundColor: "#90EE90",
  },
  "& .colored-cell-3": {
    backgroundColor: "#FFFFE0",
  },
  "& .colored-cell-4": {
    backgroundColor: "#FFB6C1",
  },
  "& .colored-cell-5": {
    backgroundColor: "#FFA07A",
  },
  "& .colored-cell-6": {
    backgroundColor: "#D8BFD8",
  },
  "& .colored-cell-7": {
    backgroundColor: "#D3D3D3",
  },
  "& .colored-cell-8": {
    backgroundColor: "#FFD700",
  },
  "& .colored-cell-9": {
    backgroundColor: "#FF6347",
  },
  "& .MuiDataGrid-row:last-child .MuiDataGrid-cell": {
    borderBottom: "1px solid #ddd",
  },
}));

interface GraphResultsProps {
  matrix: number[][];
  resetNeighbors: boolean;
  setResetNeighbors: React.Dispatch<React.SetStateAction<boolean>>;
}

const renderMatrix = (matrix: number[][], colorMatrix?: string[][]) => {
  const size = matrix.length - 1;
  const columns: GridColDef[] = [
    {
      field: "vertex",
      headerName: "",
      width: 60,
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "header-bold",
    },
    ...Array.from({ length: size }, (_, i) => ({
      field: `vertex${i + 1}`,
      headerName: `${i + 1}`,
      width: 60,
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "header-bold",
    })),
    {
      field: "degree",
      headerName: "Degree",
      width: 60,
      sortable: false,
      disableColumnMenu: true,
      headerClassName: "header-bold",
    },
  ];

  const rows: GridRowsProp = matrix.map((row, rowIndex) => {
    const rowData: {
      id: string;
      vertex: string;
      [key: string]: number | string;
    } = {
      id: `${rowIndex}`,
      vertex: rowIndex < size ? `${rowIndex + 1}` : "Degree",
    };
    row.forEach((value, colIndex) => {
      rowData[`vertex${colIndex + 1}`] = value === null ? 0 : value;
    });
    rowData["degree"] = row[row.length - 1];
    return rowData;
  });

  return (
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
      {" "}
      <Box sx={{ width: "auto" }}>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          autoHeight
          hideFooter
          getCellClassName={(params) => {
            if (params.row.id === `${matrix.length - 1}`) {
              return "last-row-cell";
            }

            if (params.field === "degree") {
              return "degree-cell";
            }

            if (colorMatrix) {
              const rowIndex = Number(params.row.id);
              const colIndex =
                params.field === "degree"
                  ? -1
                  : Number(params.field.replace("vertex", "")) - 1;

              if (
                rowIndex < size &&
                colIndex >= 0 &&
                colIndex < size &&
                colorMatrix[rowIndex] &&
                colorMatrix[rowIndex][colIndex]
              ) {
                return colorMatrix[rowIndex][colIndex];
              }
            }
            return "";
          }}
        />
      </Box>
    </Box>
  );
};

const GraphResults: React.FC<GraphResultsProps> = ({
  matrix,
  resetNeighbors,
  setResetNeighbors,
}) => {
  const [vertex, setVertex] = useState<number>(1);
  const [neighbors, setNeighbors] = useState<number[]>([]);
  const [neighborsSearched, setNeighborsSearched] = useState<boolean>(false);

  useEffect(() => {
    if (resetNeighbors) {
      setNeighbors([]);
      setNeighborsSearched(false);
      setResetNeighbors(false);
    }
  }, [resetNeighbors, setResetNeighbors]);

  const handleVertexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVertex(parseInt(event.target.value, 10));
    setNeighbors([]);
    setNeighborsSearched(false);
  };

  const findNeighbors = () => {
    setNeighborsSearched(true);
    if (vertex > 0 && vertex <= matrix.length) {
      setNeighbors(getNeighbors(matrix, vertex));
    } else {
      setNeighbors([]);
    }
  };

  const order = getGraphOrder(matrix);
  const measure = getGraphMeasure(matrix);
  const degreeSequence = getDegreeSequence(matrix);
  const isolatedVertices = getIsolatedVertices(matrix);
  const connectedComponents = getConnectedComponents(matrix);
  const complementMatrix = getComplementMatrix(matrix);
  const measureComplement = getGraphMeasureComplement(complementMatrix);
  const connectedComponentsComplement =
    getConnectedComponentsComplement(complementMatrix);

  const colorMatrix = getMatrixWithComponentColors(matrix, connectedComponents);
  const colorComplementMatrix = getMatrixWithComponentColors(
    complementMatrix,
    connectedComponentsComplement
  );

  const matrixWithDegrees = addDegreeRowsAndColumns(matrix);
  const complementMatrixWithDegrees = addDegreeRowsAndColumns(complementMatrix);

  return (
    <Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Matriz de adyacencia original:
          </Typography>
          {renderMatrix(matrixWithDegrees, colorMatrix)}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">
            Orden del grafo: <strong>{order}</strong>
          </Typography>
          <Typography variant="h6">
            Medida del grafo: <strong>{measure}</strong>
          </Typography>
          <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1, mb: 2 }}>
            <Typography variant="h6">Encuentrar vértices adyacentes</Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <TextField
                label="Vértice"
                variant="outlined"
                size="small"
                value={vertex}
                onChange={handleVertexChange}
                sx={{ mr: 2 }}
                type="number"
              />
              <Button variant="contained" onClick={findNeighbors}>
                Encontrar Adyacentes
              </Button>
            </Box>
            {neighborsSearched &&
              (neighbors.length > 0 ? (
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Vértices adyacentes a {vertex}:{" "}
                  <strong>{neighbors.join(",")}</strong>
                </Typography>
              ) : (
                <Typography variant="h6" sx={{ mt: 2 }}>
                  No hay vértices adyacentes para el vértice {vertex}.
                </Typography>
              ))}
          </Box>
          <Typography variant="h6">
            Secuencia de grados: <strong>{degreeSequence.join(",")}</strong>
          </Typography>
          <Typography variant="h6">
            Vértices aislados (
            {isolatedVertices.length > 0
              ? isolatedVertices.join(",")
              : "No hay vértices aislados"}
            ): <strong>{isolatedVertices.length}</strong>
          </Typography>
          <Typography variant="h6">
            Número de componentes conexas del grafo:{" "}
            <strong>{connectedComponents.length}</strong>
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Matriz de adyacencia del complementario:
          </Typography>
          {renderMatrix(complementMatrixWithDegrees, colorComplementMatrix)}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">
            Medida del Grafo complementario:{" "}
            <strong>{measureComplement}</strong>
          </Typography>
          <Typography variant="h6">
            Número de Componentes Conexas (Complementario):{" "}
            <strong>{connectedComponentsComplement.length}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default GraphResults;
