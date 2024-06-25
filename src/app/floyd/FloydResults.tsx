import React, { useState, useEffect } from "react";
import { DataGrid, GridCellParams, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
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
  },
  "& .fixed": {
    backgroundColor: "#FFFF00", // bright yellow background for fixed row/column
  },
  "& .updated": {
    backgroundColor: "#90ee90", // light green background for updated values
  },
}));

interface FloydResultsProps {
  floydResult: Array<{ distances: number[][]; pathMatrix: number[][]; pivot: number }>;
  initialMatrix: number[][];
  isFinal?: boolean;
}

const FloydResults: React.FC<FloydResultsProps> = ({ floydResult, initialMatrix, isFinal = false }) => {
  const [startVertex1, setStartVertex1] = useState<string | null>(null);
  const [endVertex1, setEndVertex1] = useState<string | null>(null);
  const [path1, setPath1] = useState<string | null>(null);
  const [distance1, setDistance1] = useState<number | null>(null);

  const [startVertex2, setStartVertex2] = useState<string | null>(null);
  const [endVertex2, setEndVertex2] = useState<string | null>(null);
  const [path2, setPath2] = useState<string | null>(null);
  const [distance2, setDistance2] = useState<number | null>(null);

  const [diameter, setDiameter] = useState<number | null>(null);

  const getVertexLabel = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  const handleFindPath = (
    startVertex: string | null,
    endVertex: string | null,
    setPath: React.Dispatch<React.SetStateAction<string | null>>,
    setDistance: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    if (!floydResult || startVertex === null || endVertex === null) {
      setPath("Invalid input");
      setDistance(null);
      return;
    }

    const startIdx = startVertex.charCodeAt(0) - 65;
    const endIdx = endVertex.charCodeAt(0) - 65;

    if (
      startIdx < 0 ||
      endIdx < 0 ||
      startIdx >= floydResult[0].distances.length ||
      endIdx >= floydResult[0].distances.length
    ) {
      setPath("Invalid vertices");
      setDistance(null);
      return;
    }

    const findPath = (pathMatrix: number[][], u: number, v: number): string => {
      if (u === v) return getVertexLabel(u);
      if (
        !pathMatrix[u] ||
        pathMatrix[u][v] === null ||
        pathMatrix[u][v] === u ||
        pathMatrix[u][v] === v
      ) {
        return getVertexLabel(u) + getVertexLabel(v);
      }
      return (
        findPath(pathMatrix, u, pathMatrix[u][v]) +
        findPath(pathMatrix, pathMatrix[u][v], v).substring(1)
      );
    };

    const finalStep = floydResult[floydResult.length - 1];
    const finalDistances = finalStep.distances;
    const pathMatrix = finalStep.pathMatrix;

    setPath(findPath(pathMatrix, startIdx, endIdx));
    setDistance(finalDistances[startIdx][endIdx]);
  };

  useEffect(() => {
    if (isFinal && floydResult.length > 0) {
      const finalDistances = floydResult[floydResult.length - 1].distances;
      let maxDistance = -Infinity;
      for (let i = 0; i < finalDistances.length; i++) {
        for (let j = 0; j < finalDistances[i].length; j++) {
          if (
            finalDistances[i][j] !== Infinity &&
            finalDistances[i][j] > maxDistance
          ) {
            maxDistance = finalDistances[i][j];
          }
        }
      }
      setDiameter(maxDistance);
    }
  }, [floydResult, isFinal]);

  const renderFinalTableWithControls = () => {
    const finalStep = floydResult[floydResult.length - 1];
    const size = finalStep.distances.length;
    const columns: GridColDef[] = [
      {
        field: "vertex",
        headerName: "",
        width: 90,
        sortable: false,
        disableColumnMenu: true,
      },
      ...Array.from({ length: size }, (_, i) => ({
        field: `vertex${i}`,
        headerName: getVertexLabel(i),
        width: 90,
        sortable: false,
        disableColumnMenu: true,
      })),
    ];

    const rows: GridRowsProp = finalStep.distances.map((row, rowIndex: number) => {
      const rowData: {
        id: string;
        vertex: string;
        [key: string]: number | string;
      } = {
        id: `${rowIndex}`,
        vertex: getVertexLabel(rowIndex),
      };
      row.forEach((value: number | string, colIndex: number) => {
        const numValue = typeof value === "number" ? value : parseFloat(value);
        rowData[`vertex${colIndex}`] =
          numValue === Infinity || isNaN(numValue) ? -1 : numValue;
      });
      return rowData;
    });

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Matriz de distancias finales:
          </Typography>
          <StyledDataGrid rows={rows} columns={columns} autoHeight hideFooter />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2,
            mt: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Encontrar Camino 1
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Origen</InputLabel>
              <Select
                value={startVertex1 ?? ""}
                onChange={(e) => setStartVertex1(e.target.value as string)}
              >
                {vertexOptions.map((vertex) => (
                  <MenuItem key={vertex} value={vertex}>
                    {vertex}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Destino</InputLabel>
              <Select
                value={endVertex1 ?? ""}
                onChange={(e) => setEndVertex1(e.target.value as string)}
              >
                {vertexOptions.map((vertex) => (
                  <MenuItem key={vertex} value={vertex}>
                    {vertex}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() =>
                handleFindPath(startVertex1, endVertex1, setPath1, setDistance1)
              }
            >
              Encontrar Camino
            </Button>
          </Box>
          {distance1 !== null && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Distancia mínima de {startVertex1} a {endVertex1}: {distance1}
            </Typography>
          )}
          {path1 !== null && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              El camino de coste mínimo de {startVertex1} a {endVertex1}:{" "}
              {path1}
            </Typography>
          )}
          <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
            Encontrar Camino 2
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Origen</InputLabel>
              <Select
                value={startVertex2 ?? ""}
                onChange={(e) => setStartVertex2(e.target.value as string)}
              >
                {vertexOptions.map((vertex) => (
                  <MenuItem key={vertex} value={vertex}>
                    {vertex}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Destino</InputLabel>
              <Select
                value={endVertex2 ?? ""}
                onChange={(e) => setEndVertex2(e.target.value as string)}
              >
                {vertexOptions.map((vertex) => (
                  <MenuItem key={vertex} value={vertex}>
                    {vertex}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() =>
                handleFindPath(startVertex2, endVertex2, setPath2, setDistance2)
              }
            >
              Encontrar Camino
            </Button>
          </Box>
          {distance2 !== null && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Distancia mínima de {startVertex2} a {endVertex2}: {distance2}
            </Typography>
          )}
          {path2 !== null && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              El camino de coste mínimo de {startVertex2} a {endVertex2}:{" "}
              {path2}
            </Typography>
          )}

          {isFinal && diameter !== null && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Diámetro del grafo
              </Typography>
              <Typography variant="h6">{diameter}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const renderTables = () => {
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {floydResult.map((step, stepIndex) => {
          const size = step.distances.length;
          const columns: GridColDef[] = [
            {
              field: "vertex",
              headerName: `d<sup>${stepIndex + 1}</sup>`,
              width: 90,
              sortable: false,
              disableColumnMenu: true,
              renderHeader: () => (
                <span
                  dangerouslySetInnerHTML={{
                    __html: `d<sup>${stepIndex + 1}</sup>`,
                  }}
                />
              ),
            },
            ...Array.from({ length: size }, (_, i) => ({
              field: `vertex${i}`,
              headerName: getVertexLabel(i),
              width: 90,
              sortable: false,
              disableColumnMenu: true,
              cellClassName: (params: GridCellParams) => {
                const vertexIndex = Number(params.field.replace("vertex", ""));
                const isPivotRowColumn = step.pivot === vertexIndex;
              
                if (
                  isPivotRowColumn ||
                  params.row.vertex === getVertexLabel(step.pivot)
                ) {
                  return "fixed";
                }
              
                const prevStep =
                  stepIndex === 0
                    ? initialMatrix
                    : floydResult[stepIndex - 1].distances;
                const prevValue = prevStep[params.row.id][vertexIndex];
                const currentValue = step.distances[params.row.id][vertexIndex];
                if (
                  prevValue > currentValue ||
                  (prevValue == -1 && currentValue > 0) ||
                  (isNaN(prevValue) && !isNaN(currentValue))
                ) {
                  return "updated";
                }
              
                return "";
              },
            })),
          ];

          const rows: GridRowsProp = step.distances.map((row, rowIndex: number) => {
            const rowData: {
              id: string;
              vertex: string;
              [key: string]: number | string;
            } = {
              id: `${rowIndex}`,
              vertex: getVertexLabel(rowIndex),
            };
            row.forEach((value: number | string, colIndex) => {
              const numValue = typeof value === "number" ? value : parseFloat(value);
              rowData[`vertex${colIndex}`] =
                numValue === Infinity || isNaN(numValue) ? -1 : numValue;
            });
            return rowData;
          });

          return (
            <Box key={stepIndex} sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Iteración {stepIndex + 1}
              </Typography>
              <StyledDataGrid
                rows={rows}
                columns={columns}
                autoHeight
                hideFooter
              />
            </Box>
          );
        })}
        {renderFinalTableWithControls()}
      </Box>
    );
  };

  const vertexOptions =
    floydResult && floydResult[0]
      ? Array.from({ length: floydResult[0].distances.length }, (_, i) =>
          getVertexLabel(i)
        )
      : [];

  return <Box>{renderTables()}</Box>;
};

export default FloydResults;