import React from "react";
import { AppBar, Toolbar, Typography} from "@mui/material";

import { Box } from "@material-ui/system";


export default function Header(props) {

    return (
        <Box>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>{props.title}</Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}