import React from "react";
import { AreaChart, CartesianGrid, XAxis, YAxis, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { Box } from "@mui/system";
import {
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    List,
    ListItem,
    IconButton,
    ListItemText
} from "@mui/material";

import { DeviceThermostat, Bolt, BatteryChargingFull, AutofpsSelect, ExpandMore, Delete, Edit, Add } from "@mui/icons-material/";
import styled from '@material-ui/styles/styled';

import dtUsina from '../data/dadosUsina.json';
import dtClientes from '../data/dadosClientes.json';

const Subtitle = styled(Typography)({
    color: '#45A2A1',
    padding: "0.6em"
})

const Card = styled(Box)({
    textAlign: "center",
    padding: "0em 1em"
})

export default function HomePage(params) {

    const potencia = calculaEnergia(dtUsina);
    const receita = calculaReceita(potencia);

    const [info, setInfo] = React.useState("temperatura_C");
    function changeInfoChart(event, value) {
        setInfo(value);
    }
    return (
        <Box component="main" sx={{ mt: 6 }}>
            <Subtitle variant="h4">Dados da Usina</Subtitle>
            {/* grafico */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ResponsiveContainer Width="3em" height={360} >
                    <AreaChart data={dtUsina}>
                        <Area type="monotone" dataKey={info} stroke="#45A2A1" fill="#45A2A1" />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <XAxis dataKey="tempo_h" />
                        <YAxis />
                        <Tooltip />
                    </AreaChart>
                </ResponsiveContainer>

                <ToggleButtonGroup exclusive orientation="vertical" value={info} onChange={changeInfoChart}>
                    <ToggleButton value="temperatura_C" title="Temperatura(°C)"><DeviceThermostat /></ToggleButton>
                    <ToggleButton value="tensao_V" title="tensão(V)"><Bolt /></ToggleButton>
                    <ToggleButton value="corrente_A" title="Corrente(A)">< AutofpsSelect /></ToggleButton>
                    <ToggleButton value="potencia_kW" title="Potência(Kw)"><BatteryChargingFull /></ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <Box display="flex" justifyContent="center" sx={{ marginY: 3 }}>
                <Card>
                    <Subtitle variant="h4">Receita Gerada</Subtitle>
                    <Typography variant="h3">R$ {calculaReceita(potencia).toFixed(2)}</Typography>
                </Card>
                <Card>
                    <Subtitle variant="h4">Energia Gerada</Subtitle>
                    <Typography variant="h3">{potencia.toFixed(2)} kW/h</Typography>
                </Card>
            </Box>

            <Subtitle variant="h4">
                Clientes    <Button variant="contained" startIcon={<Add />}>Adicionar</Button>
            </Subtitle>

            {dtClientes.map((cliente, index) => {
                return (
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content">
                            <Typography>{cliente.nomeCliente}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {
                                    cliente.usinas.map((usina) => {
                                        return (
                                            <ListItem>
                                                <ListItemText
                                                    primary="ID Usina"
                                                    secondary={usina.usinaId}
                                                />
                                                <ListItemText
                                                    primary="Participação(%)"
                                                    secondary={usina.percentualDeParticipacao + "%"}
                                                />
                                                <ListItemText
                                                    primary="Receita(R$)"
                                                    secondary={calculaReceitaCliente(usina.percentualDeParticipacao, receita).toFixed(2)}
                                                />
                                                <IconButton edge="end" aria-label="edit">
                                                    <Edit />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" sx={{ marginX: 2 }}>
                                                    <Delete />
                                                </IconButton>
                                            </ListItem>
                                        );
                                    })
                                }
                                <Button variant="text" startIcon={<Add />}>
                                    Adicionar Usina
                                </Button>
                            </List>
                            <Button variant="text" color="warning">Editar</Button>
                            <Button variant="text" color="error">Remover</Button>
                        </AccordionDetails>
                    </Accordion>
                );
            })}

        </Box >
    );
}

function calculaReceita(potencia) {
    const valorEnergia = 0.95 //reais

    return potencia * valorEnergia;
}

function calculaEnergia(data) {
    let dts = [];
    /* Calcula a variação do tempo */
    for (let i = 0; i < data.length - 1; i++) {
        const dif = data[i + 1].tempo_h - data[i].tempo_h;
        dts.push(dif);
    }
    const dt = dts.reduce((total, value) => { return total + value }) / dts.length;
    let potencia = []
    data.forEach(element => {
        potencia.push(element.potencia_kW);
    });
    potencia = potencia.reduce((total, value) => { return total + value })
    return potencia * dt;
}

function calculaReceitaCliente(participacao, receita) {
    return (participacao / 100) * receita;
}