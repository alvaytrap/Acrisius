"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { CssBaseline, Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import './globals.css';

const drawerWidth = 240;

interface NavProps {
  children?: ReactNode;
}

const Nav: React.FC = () => {
  const pathname = usePathname(); 

  const menuItems = [
    { text: 'Inicio', href: '/' },
    { text: 'Dijkstra (Camino mínimo)', href: '/dijkstra' },
    { text: 'Floyd (Distancia mínima)', href: '/floyd' },
    { text: 'Kruskal (Árbol generador minimal)', href: '/kruskal' },
    { text: 'Knapsack (Problema de la mochila)', href: '/knapsack' },
    { text: 'Análisis de grafo (Orden, medida y componentes)', href: '/graphAnalysis'}
  ];

  return (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.href} component="div">
          <Link href={item.href} passHref legacyBehavior>
            <a style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
              <ListItemText
                primary={item.text}
                sx={{
                  backgroundColor: pathname === item.href ? 'rgba(0, 0, 0, 0.08)' : 'inherit',
                  borderRadius: 1,
                  padding: 1,
                }}
              />
            </a>
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

const Footer: React.FC = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('es-ES', options);
  };

  return (
    <Box component="footer" sx={{ py: 2, textAlign: 'center', mt: 'auto', backgroundColor: '#333', color: 'white' }}>
      <div>{getCurrentDate()}</div>
    </Box>
  );
};

const RootLayout: React.FC<NavProps> = ({ children }) => {
  const pathname = usePathname(); 
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const sectionNames: { [key: string]: string } = {
      '/': 'Home',
      '/dijkstra': 'Dijkstra (Camino mínimo)',
      '/floyd': 'Floyd (Distancia mínima)',
      '/kruskal': 'Kruskal (Árbol generador minimal)',
      '/knapsack': 'Problema de la mochila (Knapsack)',
      '/graphAnalysis': 'Análisis de grafo (Orden, medida y componentes)'
    };

    const sectionName = sectionNames[pathname] || 'Acrisius';
    const title = `${sectionName} - Acrisius`;
    document.title = title;
  }, [pathname]);

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Acrisius</title>
      </head>
      <body>
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
          <CssBaseline />
          <Box sx={{ display: 'flex', flexGrow: 1, mt: 8 }}>
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
              >
                <Nav />
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
              >
                <Nav />
              </Drawer>
            </Box>
            <Box
              component="main"
              sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
            >
              {children}
            </Box>
          </Box>
          <Footer />
        </Box>
      </body>
    </html>
  );
};

export default RootLayout;
