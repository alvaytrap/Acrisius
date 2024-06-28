import React, { useMemo, useCallback } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  useGridApiRef,
  GridEventListener,
} from "@mui/x-data-grid";
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
}));

interface MatrixDataGridProps {
  size: number;
  matrix: (number | null)[][];
  onMatrixChange: (matrix: (number | null)[][]) => void;
  labelType: "letters" | "numbers";
}

const MatrixDataGrid: React.FC<MatrixDataGridProps> = ({
  size,
  matrix,
  onMatrixChange,
  labelType,
}) => {
  const apiRef = useGridApiRef();

  const getVertexLabel = useCallback((index: number): string => {
    if (labelType === "letters") {

      return String.fromCharCode(65 + index);

    } else {

      return (index + 1).toString();

    }
  }, [labelType]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Vertex",
        width: 90,
        sortable: false,
        disableColumnMenu: true,
        renderHeader: (params: any) => (
          <strong>{params.colDef.headerName}</strong>
        ),
        renderCell: (params: any) => <strong>{params.value}</strong>,
        cellClassName: "MuiDataGrid-cell--textCenter",
      },
      ...Array.from({ length: size }, (_, i) => ({
        field: `vertex${i}`,
        headerName: getVertexLabel(i),
        width: 90,
        type: "number" as const,
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        renderHeader: (params: any) => (
          <strong>{params.colDef.headerName}</strong>
        ),
        cellClassName: "MuiDataGrid-cell--textCenter",
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
    (newRow: any) => {
      const rowIndex = labelType === "letters" ? Number(newRow.id.charCodeAt(0) - 65) : Number(newRow.id) - 1;
      const newMatrix = matrix.map((row, i) => {
        if (i !== rowIndex) return row;
        return row.map((val, j) => {
          const field = `vertex${j}`;
          return newRow[field] === "" ? null : Number(newRow[field]);
        });
      });
      onMatrixChange(newMatrix);
      return newRow;
    },
    [matrix, onMatrixChange, labelType]
  );

  const handleCellKeyDown: GridEventListener<"cellKeyDown"> = useCallback(
    (params, event) => {
      const { field, id } = params;
      const colIndex = columns.findIndex((col) => col.field === field);
      const rowIndex = rows.findIndex((row) => row.id === id);

      let nextColIndex = colIndex;
      let nextRowIndex = rowIndex;

      const isArrowKey = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ].includes(event.key);

      if (isArrowKey || event.key === "Tab") {
        event.preventDefault();

        if (event.key === "ArrowUp") {
          nextRowIndex = rowIndex > 0 ? rowIndex - 1 : rows.length - 1;
        } else if (event.key === "ArrowDown") {
          nextRowIndex = rowIndex < rows.length - 1 ? rowIndex + 1 : 0;
        } else if (event.key === "ArrowLeft") {
          nextColIndex = colIndex > 1 ? colIndex - 1 : columns.length - 1;
        } else if (event.key === "ArrowRight") {
          nextColIndex = colIndex < columns.length - 1 ? colIndex + 1 : 1;
        } else if (event.key === "Tab") {
          nextColIndex = colIndex + 1;
          if (nextColIndex >= columns.length - 1) {
            nextColIndex = 1;
            nextRowIndex++;
            if (nextRowIndex >= rows.length) {
              nextRowIndex = 0;
            }
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
  );
};

export default MatrixDataGrid;
