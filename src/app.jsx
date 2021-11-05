import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomePage from "./pages/home.page";
import Header from "./components/header";
/* import  ClientPage  from "./pages/client.page"; */

export default function App() {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#45A2A1',
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header title="Dashboard Usina"/>
            <HomePage />
        </ThemeProvider>
    );
}
