// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField';

// const useStyles = makeStyles(theme => ({
//   root: {
//     '& > *': {
//       margin: theme.spacing(1),
//       width: 200,

//     },
//   },
// }));

// export  function BasicTextFields() {
//   const classes = useStyles();

//   return (
//     <form className={classes.root} noValidate autoComplete="off">
//         <TextField
//           label="Quantity"
//           id="outlined-size-small"
//           defaultValue="0"
//           variant="outlined"
//           size="small"
//         />
//     </form>
//   );
// }

// // export  function MultilineTextFields() {
// //     const classes = useStyles();
  
// //     return (
// //       <form className={classes.root} noValidate autoComplete="off">
// //         <TextField
// //           id="outlined-select-currency-native"
// //           select
// //           label="Select Product"
// //         //   value={currency}
// //         //   onChange={handleChange}
// //           SelectProps={{
// //             native: true,
// //           }}
// //           helperText="Please select your Product"
// //           variant="outlined"
// //         >
// //           {/* {currencies.map(option => (
// //             <option key={option.value} value={option.value}>
// //               {option.label}
// //             </option>
// //           ))} */}
// //         </TextField>
// //       </form>
// //     );
// //   }