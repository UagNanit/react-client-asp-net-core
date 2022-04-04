import React, { useContext, useState } from "react";
import { UserContext } from "./context";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AlternateEmailSharpIcon from "@mui/icons-material/AlternateEmailSharp";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Redirect } from "react-router";
import { variables } from "./variables";

export default function Authentication() {
  const { userCon, setUserCon } = useContext(UserContext);

  const [valuesLogin, setValuesLogin] = useState({
    email: "",
    password: "",
    showPassword: false
  });
  const [openErr, setOpenErr] = useState(false);

  const handleChange = (prop) => (event) => {
    setValuesLogin({ ...valuesLogin, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValuesLogin({
      ...valuesLogin,
      showPassword: !valuesLogin.showPassword
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    console.log(valuesLogin.email + " " + valuesLogin.password);
    await fetch(variables.API_URL + "api/Account/Token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Email: valuesLogin.email,
        Password: valuesLogin.password
      })
    })
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (data) {
          console.log(data);
          sessionStorage.setItem(variables.tokenKey, data.access_token);
          setUserCon(true);
          setValuesLogin({
            email: "",
            password: "",
            showPassword: false
          });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("catch error Code: " + errorCode);
        console.log("catch error Message: " + errorMessage);
        setOpenErr(true);
      });
  };

  if (userCon === true) {
    return <Redirect to={`/books`} />;
  } else {
    return (
      <Dialog open={true}>
        <Collapse in={openErr}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpenErr(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 0, fontWeight: "bold" }}
          >
            <AlertTitle>Error</AlertTitle>
            Incorrect Email or Password!
          </Alert>
        </Collapse>
        <div>mail: admin@gmail.com / pas: 123456</div>
        <div>mail: user@gmail.com / pas: 123456</div>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontWeight: "bold" }}>
            Enter email address and password
          </DialogContentText>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <div>
              <TextField
                label="Email"
                id="outlined-start-adornment"
                sx={{ m: 1, width: "25ch" }}
                value={valuesLogin.mail}
                onChange={handleChange("email")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {" "}
                      <AlternateEmailSharpIcon />
                    </InputAdornment>
                  )
                }}
              />

              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={valuesLogin.showPassword ? "text" : "password"}
                  value={valuesLogin.password}
                  onChange={handleChange("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {valuesLogin.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
