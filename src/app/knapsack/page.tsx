"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearAllIcon from "@mui/icons-material/ClearAll";

import { knapsack, Item } from "./knapsack";

const Knapsack: React.FC = () => {
  const [capacity, setCapacity] = useState<number>(0);
  const [items, setItems] = useState<Item[]>([]);
  const [inputString, setInputString] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);
  const [value, setValue] = useState<number>(0);
  const [solution, setSolution] = useState<Item[]>([]);
  const [alternatives, setAlternatives] = useState<Item[][]>([]);
  const [format, setFormat] = useState<string>("weight-value");
  const [defaultNameIndex, setDefaultNameIndex] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const getDefaultName = (): string => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[defaultNameIndex % alphabet.length];
  };

  const addItem = () => {
    const newItem: Item = {
      name: name || getDefaultName(),
      weight,
      value,
    };
    setItems([...items, newItem]);
    setName("");
    setWeight(0);
    setValue(0);
    setDefaultNameIndex(defaultNameIndex + 1);
    setShowSolution(false);
  };

  const parseItems = (input: string, format: string): Item[] => {
    const itemsArray: Item[] = [];
    const regex =
      /([A-Z\u{1D400}-\u{1D7FF}])\s*=\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)\s*,?/gu;
    //const regex = /([A-Z])\s*=\s*\((\d+),\s*(\d+)\)\s*(?:,|y)?/g;
    let match;

    while ((match = regex.exec(input)) !== null) {
      if (format === "weight-value") {
        itemsArray.push({
          name: match[1],
          weight: parseInt(match[2]),
          value: parseInt(match[3]),
        });
      } else {
        itemsArray.push({
          name: match[1],
          value: parseInt(match[2]),
          weight: parseInt(match[3]),
        });
      }
    }

    return itemsArray;
  };

  const addItemsFromString = () => {
    const parsedItems = parseItems(inputString, format);
    setItems([...items, ...parsedItems]);
    setShowSolution(false);
  };

  const solveKnapsack = () => {
    const result = knapsack(capacity, items);
    setSolution(result.optimal);
    setAlternatives(result.alternatives);
    setShowSolution(true);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    setShowSolution(false);
  };

  const removeAllItems = () => {
    setItems([]);
    setShowSolution(false);
  };

  const getTotalWeightAndValue = (items: Item[]) => {
    return items.reduce(
      (acc, item) => {
        acc.weight += item.weight;
        acc.value += item.value;
        return acc;
      },
      { weight: 0, value: 0 }
    );
  };

  const getItemNames = (items: Item[]) => {
    return items.map((item) => item.name).join(", ");
  };

  return (
    <Container>
      <h1>Knapsack (Problema de la mochila)</h1>
      <TextField
        label="Capacidad"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(parseInt(e.target.value))}
        fullWidth
        margin="normal"
      />

      <h3>Añadir objetos manualmente</h3>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Peso"
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Valor"
                type="number"
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" onClick={addItem}>
            Añadir objeto
          </Button>
        </CardContent>
      </Card>

      <div style={{ marginTop: "20px" }}>
        <h3>Importar desde enunciado</h3>
        <Card>
          <CardContent>
            <TextField
              label="Ítems (e.g., A=(10,7), B=(5,8))"
              value={inputString}
              onChange={(e) => setInputString(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Ingrese los objetos en el formato A=(peso,valor), B=(peso,valor)"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Formato</InputLabel>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Seleccionar formato
                </MenuItem>
                <MenuItem value="weight-value">Peso, Valor</MenuItem>
                <MenuItem value="value-weight">Valor, Peso</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={addItemsFromString}
            >
              Importar objetos
            </Button>
          </CardContent>
        </Card>
      </div>

      <h2 style={{ marginTop: "20px" }}>Lista de objetos</h2>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            {item.name}=({item.weight},{item.value}) Nombre: {item.name}, Peso:{" "}
            {item.weight}, Valor: {item.value}
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => removeItem(index)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="error"
        onClick={removeAllItems}
        startIcon={<ClearAllIcon />}
      >
        Eliminar todos los Objetos
      </Button>
      <h2 style={{ marginTop: "20px" }}>Resultado:</h2>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <Button variant="contained" color="success" onClick={solveKnapsack}>
          Resolver Problema de la Mochila
        </Button>
      </div>

      {showSolution && (
        <>
          <h2 style={{ marginTop: "20px" }}>Solución:</h2>
          {solution.length > 0 ? (
            <>
              <List>
                {solution.map((item, index) => (
                  <ListItem key={index}>
                    {item.name}=({item.weight},{item.value}) Nombre: {item.name}
                    , Peso: {item.weight}, Valor: {item.value}
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6">
                Objetos: {getItemNames(solution)}, Suma de Pesos:{" "}
                {getTotalWeightAndValue(solution).weight}, Suma de Valores:{" "}
                {getTotalWeightAndValue(solution).value}
              </Typography>
            </>
          ) : (
            <ListItem>No existe solución para la capacidad {capacity}</ListItem>
          )}

          <h3 style={{ marginTop: "20px" }}>Descartadas (Subóptimas)</h3>
          {alternatives.length > 0 ? (
            alternatives.map((alternative, altIndex) => (
              <div key={altIndex}>
                <List>
                  {alternative.map((item, index) => (
                    <ListItem key={index}>
                      {item.name}=({item.weight},{item.value}) Nombre:{" "}
                      {item.name}, Peso: {item.weight}, Valor: {item.value}
                    </ListItem>
                  ))}
                </List>
                <Typography variant="h6">
                  Objetos: {getItemNames(alternative)}, Suma de Pesos:{" "}
                  {getTotalWeightAndValue(alternative).weight}, Suma de Valores:{" "}
                  {getTotalWeightAndValue(alternative).value}
                </Typography>
              </div>
            ))
          ) : (
            <ListItem>No existe solución para la capacidad {capacity}</ListItem>
          )}
        </>
      )}
    </Container>
  );
};

export default Knapsack;
