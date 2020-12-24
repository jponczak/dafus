import { blue } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2d4059',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: blue.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
