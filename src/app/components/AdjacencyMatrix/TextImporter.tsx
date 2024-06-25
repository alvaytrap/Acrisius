import React, { useCallback, ChangeEvent } from "react";
import { TextareaAutosize, Box, Stack, Button } from "@mui/material";

interface TextImporterProps {
  size: number;
  textValue: string;
  setTextValue: (value: string) => void;
  onMatrixChange: (matrix: (number | null)[][]) => void;
  setErrorMessage: (message: string) => void;
  setErrorOpen: (open: boolean) => void;
}

const TextImporter: React.FC<TextImporterProps> = ({
  size,
  textValue,
  setTextValue,
  onMatrixChange,
  setErrorMessage,
  setErrorOpen
}) => {

  const handleTextChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
  }, [setTextValue]);

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
      onMatrixChange(parsedMatrix);
    } else {
      setErrorMessage(`Los datos proporcionados no coinciden con el tamaño esperado de la matriz ${size}x${size}.`);
      setErrorOpen(true);
    }
  }, [textValue, size, parseText, onMatrixChange, setErrorMessage, setErrorOpen]);

  const clearText = useCallback(() => {
    setTextValue("");
  }, [setTextValue]);

  return (
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
  );
};

export default TextImporter;
