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
} from "@mui/material";

import { knapsack, Item } from "./knapsack";

const Knapsack: React.FC = () => {
  const [capacity, setCapacity] = useState<number>(0);
  const [items, setItems] = useState<Item[]>([]);
  const [inputString, setInputString] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);
  const [value, setValue] = useState<number>(0);
  const [solution, setSolution] = useState<Item[]>([]);
  const [format, setFormat] = useState<string>("weight-value");
  const [defaultNameIndex, setDefaultNameIndex] = useState<number>(0);

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
  };

  const parseItems = (input: string, format: string): Item[] => {
    const itemsArray: Item[] = [];
    const regex = /([A-Z])\s*=\s*\((\d+),\s*(\d+)\)\s*(?:,|y)?/g;
    let match;

    while ((match = regex.exec(input)) !== null) {
      if (format === 'weight-value') {
        itemsArray.push({
          name: match[1],
          weight: parseInt(match[2]),
          value: parseInt(match[3])
        });
      } else {
        itemsArray.push({
          name: match[1],
          value: parseInt(match[2]),
          weight: parseInt(match[3])
        });
      }
    }

    return itemsArray;
  };

  const addItemsFromString = () => {
    const parsedItems = parseItems(inputString, format);
    setItems([...items, ...parsedItems]);
    setInputString("");
  };

  const solveKnapsack = () => {
    const result = knapsack(capacity, items);
    setSolution(result);
  };

  return (
    <Container>
      <Typography variant="h1">Knapsack Solver</Typography>
      <TextField
        label="Capacity"
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(parseInt(e.target.value))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Weight"
        type="number"
        value={weight}
        onChange={(e) => setWeight(parseInt(e.target.value))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Value"
        type="number"
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value))}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={addItem} fullWidth>
        Add Item Manually
      </Button>
      <Typography variant="h2">Items</Typography>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            Name: {item.name}, Weight: {item.weight}, Value: {item.value}
          </ListItem>
        ))}
      </List>
      <TextField
        label="Items (e.g., A=(10,7), B=(5,8))"
        value={inputString}
        onChange={(e) => setInputString(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Format</InputLabel>
        <Select value={format} onChange={(e) => setFormat(e.target.value)}>
          <MenuItem value="weight-value">Weight, Value</MenuItem>
          <MenuItem value="value-weight">Value, Weight</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={addItemsFromString}
        fullWidth
      >
        Add Items from String
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={solveKnapsack}
        fullWidth
      >
        Solve Knapsack
      </Button>
      <Typography variant="h2">Solution</Typography>
      <List>
        {solution.map((item, index) => (
          <ListItem key={index}>
            Name: {item.name}, Weight: {item.weight}, Value: {item.value}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Knapsack;
