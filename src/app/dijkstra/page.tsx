"use client";
import React from 'react';
import DijkstraAlgorithm from './DijkstraAlgorithm';

const Dijkstra: React.FC = () => {
  return (
    <div>
      <h1>Dijkstra (Camino mínimo)</h1>
      <DijkstraAlgorithm />
    </div>
  );
};

export default Dijkstra;