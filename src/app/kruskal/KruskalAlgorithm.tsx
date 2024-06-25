"use client";
import React, { useState, useCallback } from "react";
import { Box, Typography, Button } from "@mui/material";
import AdjacencyMatrix from "@/app/components/AdjacencyMatrix";
import { styled } from "@mui/system";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaders": {
    display: "none",
  },
  "& .MuiDataGrid-cell": {
    border: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .selected": {
    backgroundColor: "#90ee90 !important",
    fontWeight: "bold",
  },
  "& .discarded": {
    backgroundColor: "#d3d3d3 !important",
  },
}));

const KruskalAlgorithm: React.FC = () => {
  const [matrix, setMatrix] = useState<(number | null)[][]>([]);
  const [sortedEdges, setSortedEdges] = useState<
    { edge: string; weight: number }[]
  >([]);
  const [mstEdges, setMstEdges] = useState<{ edge: string; weight: number }[]>(
    []
  );
  const [iterations, setIterations] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [multipleMST, setMultipleMST] = useState<boolean>(false);

  const handleMatrixChange = useCallback((newMatrix: (number | null)[][]) => {
    setMatrix(newMatrix);
    setShowResults(false);
    setIterations([]);
    setTotalCost(0);
    setMstEdges([]);
  }, []);

  const handleRunKruskal = useCallback(() => {
    const edges: { edge: string; weight: number }[] = [];
    const size = matrix.length;

    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        if (matrix[i][j] !== null && matrix[i][j] !== 0) {
          edges.push({
            edge: `${String.fromCharCode(65 + i)},${String.fromCharCode(
              65 + j
            )}`,
            weight: matrix[i][j]!,
          });
        }
      }
    }

    edges.sort((a, b) => a.weight - b.weight);
    setSortedEdges(edges);

    const parent = Array.from({ length: size }, (_, i) => i);
    const rank = Array(size).fill(0);

    const find = (parent: number[], i: number): number => {
      if (parent[i] === i) return i;
      return find(parent, parent[i]);
    };

    const union = (parent: number[], rank: number[], x: number, y: number) => {
      const xroot = find(parent, x);
      const yroot = find(parent, y);

      if (rank[xroot] < rank[yroot]) {
        parent[xroot] = yroot;
      } else if (rank[xroot] > rank[yroot]) {
        parent[yroot] = xroot;
      } else {
        parent[yroot] = xroot;
        rank[xroot]++;
      }
    };

    const result: { edge: string; weight: number }[] = [];
    let e = 0;
    let i = 0;
    let iterationIndex = 1;

    const newIterations: string[] = [];
    let total = 0;

    newIterations.push("it 0 T = {∅}");

    while (e < size - 1 && i < edges.length) {
      const nextEdge = edges[i++];
      const x = find(parent, nextEdge.edge.charCodeAt(0) - 65);
      const y = find(parent, nextEdge.edge.charCodeAt(2) - 65);

      if (x !== y) {
        result.push(nextEdge);
        union(parent, rank, x, y);
        e++;
        newIterations.push(
          `it ${iterationIndex} T = {${result
            .map((edge) => `(${edge.edge})`)
            .join(",")}}`
        );
        total += nextEdge.weight;
      } else {
        newIterations.push(
          `it ${iterationIndex} Se descarta (${nextEdge.edge}) porque forma ciclo.`
        );
      }
      iterationIndex++;
    }

    // Determinar si hay múltiples MST posibles
    const uniqueWeights = new Set(edges.map((e) => e.weight));
    const weightCounts = Array.from(uniqueWeights).map(
      (w) => edges.filter((e) => e.weight === w).length
    );
    setMultipleMST(weightCounts.some((count) => count > 1));

    setMstEdges(result);
    setIterations(newIterations);
    setTotalCost(total);
    setShowResults(true);
  }, [matrix]);

  const columns: GridColDef[] = [
    {
      field: "label",
      headerName: "",
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: "bold" }}>{params.value}</Typography>
      ),
    },
    ...sortedEdges.map((_, index) => ({
      field: `edge${index}`,
      headerName: "",
      width: 90,
      renderCell: (params) => {
        const edge = params.value;
        const isSelected = mstEdges.some((e) => e.edge === edge);
        return (
          <Typography
            sx={{
              fontWeight: isSelected ? "bold" : "normal",
            }}
          >
            {isSelected ? `(${edge})*` : `(${edge})`}
          </Typography>
        );
      },
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      cellClassName: (params) =>
        mstEdges.some((e) => e.edge === sortedEdges[index].edge)
          ? "selected"
          : "discarded",
    })),
  ];

  const rows: GridRowsProp = [
    {
      id: 0,
      label: "Arista",
      ...sortedEdges.reduce((acc, edge, index) => {
        acc[`edge${index}`] = edge.edge;
        return acc;
      }, {}),
    },
    {
      id: 1,
      label: "Peso",
      ...sortedEdges.reduce((acc, edge, index) => {
        acc[`edge${index}`] = edge.weight;
        return acc;
      }, {}),
    },
  ];

  const n = matrix.length;
  const nMinusOne = n - 1;
  const edgesString = mstEdges.map((e) => e.weight).join(" + ");
  const costString = `${edgesString} = ${totalCost}`;

  return (
    <div>
      <Box sx={{ p: 2 }}>
        <AdjacencyMatrix
          onMatrixChange={handleMatrixChange}
          initialSize={6}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleRunKruskal}
          sx={{ mt: 4, mb: 4 }}
        >
          Ejecutar Kruskal
        </Button>
        {showResults && (
          <StyledDataGrid
            rows={rows}
            columns={columns}
            autoHeight
            hideFooter
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
          />
        )}
        {iterations.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Iteraciones:</Typography>
            {iterations.map((iteration, index) => (
              <Typography key={index}>{iteration}</Typography>
            ))}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Se verifica que TODOS los vértices de G están en T y que hay n ={" "}
              {n} y n – 1 = {nMinusOne} aristas en T y el árbol minimal T es el
              representado arriba, cuyo coste total es de {costString}.
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cual es el coste mínimo para conectar todos los vértices del grafo
              G?
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>{totalCost}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Aristas que conectan todos los vértices del grafo G con coste
              mínimo:
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {mstEdges.map((edge) => edge.edge.replace(",", "")).join(",")}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              ¿Existe otro conjunto de aristas distinto que represente otro
              árbol generador minimal distinto al anterior?
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
              {multipleMST ? "Sí" : "No"}
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default KruskalAlgorithm;
