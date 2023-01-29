import React from 'react';
import './RecPage.css';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

  export default function RecommendationPage() {

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });


    const [genre, setGenre] = React.useState('');
    
    const handleChange = (event) => {
        setGenre(event.target.value);
    };
    

    return (

        <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <div className="surround">

            <div className='field'>
                <TextField id="outlined-number" label="Duration of playlist (minutes)" type="number" InputLabelProps={{shrink: true,}} style = {{width:350}}/>
            </div>
            
            <div className='field'>
                <TextField id="outlined-basic" label="Playlist Name" variant="outlined" InputLabelProps={{shrink: true,}} style = {{width:350}} />
            </div>



            <div className='field'>
                <FormControl style = {{width:350}}>
                    <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={genre}
                    label="Genre"
                    onChange={handleChange}
                    >
                    <MenuItem value={1}>Pop</MenuItem>
                    <MenuItem value={2}>Rock</MenuItem>
                    <MenuItem value={3}>Jazz</MenuItem>
                    <MenuItem value={4}>Classical</MenuItem>

                    </Select>
                </FormControl>
            </div>

            <div className='field'>
                <Button color="success" variant="outlined">Generate Playlist</Button>
            </div>





        </div>
        </ThemeProvider>


    );
}

