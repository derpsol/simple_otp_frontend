import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import OTPInput from "react-otp-input";
import { makeStyles } from "@mui/styles";
import {useAuthContext} from '../auth/useAuthContext';

const useStyles = makeStyles({
  input: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: 'wrap',
    width: "400px",
    margin: "4px",
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
});

function Home() {
  const {verify} = useAuthContext();
  const classes = useStyles();
  const [otp, setOtp] = useState("");
  const onChange = (value: string) => {
    setOtp(value);
  };
  const [type, setType] = useState('email');
  const [digit, setDigit] = useState('4');

  const onCodeSubmit = async () => {
    try {
      if (verify) {
        const message = await verify(type, otp);
      }
    } catch (error: any) {
    }
  };

  return (
    
    <Box display="flex" alignItems="center" mt="20px" flexDirection="column">
      <TextField placeholder="Enter Number of OTP" onChange={(e) => {setDigit(e.target.value)}} sx={{mb: '20px'}}/>
      <TextField placeholder="Enter Email" sx={{mb: '20px'}}/>
      <Button className="btn btn-success" variant="contained" sx={{mb: '20px'}}>Send Verification Code</Button>
      <OTPInput
        value={otp}
        onChange={onChange}
        numInputs={parseInt(digit)}
        shouldAutoFocus
        inputType="number"
        renderInput={(props) => <input {...props} />}
        containerStyle={useStyles().input}
        inputStyle={{
          textAlign: "center",
          fontSize: 30,
          width: "56px",
          height: "56px",
          border: "2px #545454 solid",
          borderRadius: "4px",
          // WebkitAppearance: 'textfield',
          // MozAppearance: 'textfield',
          appearance: "none",
        }}
      />
    </Box>
  );
}

export default Home;
