// components/DijkstraResults.tsx
"use client";
import React from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridCellParams } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-cell': {
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd',
  },
  '& .MuiDataGrid-columnHeader': {
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiDataGrid-columnHeaderTitleContainer': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .fixed': {
    backgroundColor: '#d0f0c0', // light green background for fixed values
  },
  '& .updated': {
    backgroundColor: '#90ee90', // light green background for updated values
  },
  '& .pivot': {
    backgroundColor: '#d3d3d3', // light grey background for pivot column
  },
}));

const DijkstraResults: React.FC<{ dijkstraResult: any, size: number }> = ({ dijkstraResult, size }) => {
  const getVertexLabel = (index: number): string => {
    return String.fromCharCode(65 + index); // 65 is the ASCII code for 'A'
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Paso',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
    },
    ...Array.from({ length: size }, (_, i) => ({
      field: `vertex${i}`,
      headerName: getVertexLabel(i),
      width: 90,
      sortable: false,
      disableColumnMenu: true,
      cellClassName: (params: GridCellParams) => {
        const stepIndex = Number(params.row.id.split('=')[1]);
        const vertexIndex = Number(params.field.replace('vertex', ''));
        const currentStep = dijkstraResult[stepIndex];
        const previousStep = dijkstraResult[stepIndex - 1];

        let isPivotColumn = false;
        for (let k = 0; k <= stepIndex; k++) {
          if (dijkstraResult[k].pivot === vertexIndex) {
            isPivotColumn = true;
            break;
          }
        }

        if (isPivotColumn) {
          return 'pivot';
        } else if (previousStep && currentStep.distances[vertexIndex] !== previousStep.distances[vertexIndex]) {
          return 'updated';
        }
        return '';
      },
    })),
    {
      field: 'pivot',
      headerName: 'Pivot',
      width: 90,
      sortable: false,
      disableColumnMenu: true,
    }
  ];

  const rows: GridRowsProp = dijkstraResult.map((step: any, i: number) => {
    const rowData: { id: string, [key: string]: number | string } = { id: `Paso i=${i}` };
    step.distances.forEach((value: number, j: number) => {
      rowData[`vertex${j}`] = value === Infinity ? -1 : value;
    });
    rowData['pivot'] = getVertexLabel(step.pivot);
    return rowData;
  });

  return (
    <Box sx={{ height: 'auto', width: '100%' }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        autoHeight
        hideFooter
      />
    </Box>
  );
};

export default DijkstraResults;
