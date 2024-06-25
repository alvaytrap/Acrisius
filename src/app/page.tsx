import styles from "./page.module.css";
import { Typography } from "@mui/material";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Typography variant="h1" component="h1" gutterBottom>
          Algoritmos de Grafos
        </Typography>
        <Typography variant="h2" component="h2" gutterBottom>
          Acrisius
        </Typography>
      </div>
    </main>
  );
}
