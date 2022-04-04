import "./styles.css";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import { UserContext } from "./components/context";
import Tooltip from "@mui/material/Tooltip";
import Form from "./components/PostPutForm";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Home from "./components/Home";
import Authors from "./components/Authors";
import Authentication from "./components/Authentication";
import { variables } from "./components/variables";

function LinkTab(props) {
  let history = useHistory();
  return (
    <Tab
      onClick={(event) => {
        history.push(props.href);
        event.preventDefault();
      }}
      {...props}
    />
  );
}

async function IsAuth() {
  await fetch(variables.API_URL + "api/BooksApi/Auth", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${sessionStorage.getItem(variables.tokenKey)}`,
      mode: "cors",
      credentials: "include"
    }
  })
    .then((response) => {
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("catch error Code: " + errorCode);
      console.log("catch error Message: " + errorMessage);
    });
}

export default function App() {
  const [valueNav, setValueNav] = useState(0);
  const [user, setUser] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(variables.tokenKey) !== null) {
      if (IsAuth()) {
        setUser(true);
      }
    }
  }, []);

  const handleChangeNav = (event, newValue) => {
    setValueNav(newValue);
  };

  const handleLogout = () => {
    setUser(false);
    sessionStorage.removeItem(variables.tokenKey);
  };

  return (
    <UserContext.Provider
      value={{
        userCon: user,
        setUserCon: (val) => setUser(val)
      }}
    >
      <div className="App">
        <Router>
          <nav>
            <Box sx={{ width: "100%", display: "flex", flexDirection: "row" }}>
              <Tabs
                value={valueNav}
                onChange={handleChangeNav}
                aria-label="nav tabs example"
              >
                <LinkTab label="Home" href="/books" />
                <LinkTab label="Authors" href="/authors" />

                {user === true ? (
                  <Tooltip title={"Sign Out"}>
                    <Button
                      onClick={handleLogout}
                      color="secondary"
                      variant="outlined"
                    >
                      Logout
                    </Button>
                  </Tooltip>
                ) : (
                  <p></p>
                )}
              </Tabs>
            </Box>
          </nav>
          <Switch>
            <Route exact path="/" component={Authentication} />
            <Route path="/books" component={Home} />
            <Route path="/authors" component={Authors} />
            <Route path="/form/:id" component={Form} />
            <Route children={() => <h1>404 page</h1>} />
          </Switch>
        </Router>
      </div>
    </UserContext.Provider>
  );
}
