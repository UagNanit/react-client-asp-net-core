import React, { useContext, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import { Redirect } from "react-router";
import { useHistory } from "react-router-dom";
import { variables } from "./variables";
import { UserContext } from "./context";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    //backgroundColor: "#42a5f5"
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 5
  }
}));

export default function Home() {
  const { userCon, setUserCon } = useContext(UserContext);
  const [loadingData, setloadingData] = useState(true);
  const [dataBooks, setDataBooks] = useState([]);
  const [authorsData, setAuthorsData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(-1);
  const token = sessionStorage.getItem(variables.tokenKey);

  useEffect(() => {
    getDataBooksAndAuthors();
  }, []);

  async function getDataBooksAndAuthors() {
    console.log(`Bearer ${token}`);
    await fetch(variables.API_URL + "api/BooksApi/Books", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
        credentials: "include"
      }
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
          setDataBooks(data);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("catch error Code: " + errorCode);
        console.log("catch error Message: " + errorMessage);
      });

    await fetch(variables.API_URL + "api/BooksApi/Authors", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
        credentials: "include"
      }
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
          setAuthorsData(data);
          setloadingData(false);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("catch error Code: " + errorCode);
        console.log("catch error Message: " + errorMessage);
      });
  }

  async function DeleteBook(id) {
    await fetch(variables.API_URL + "api/BooksApi/Books/" + id, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
        credentials: "include"
      }
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
          getDataBooksAndAuthors();
        });
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }

  const isSelected = (id) => id !== selectedRow;
  let history = useHistory();

  const handleDelete = (event) => {
    const conf = window.confirm("Delete? Are you sure?");
    if (selectedRow > -1 || conf) {
      DeleteBook(selectedRow);
      setSelectedRow(-1);
      getDataBooksAndAuthors();
    }
  };

  const handleEdit = (event) => {
    history.push("/form/" + selectedRow);
  };
  const handleCreate = (event) => {
    history.push("/form/-1");
  };

  if (!userCon) {
    return <Redirect to={`/`} />;
  }

  if (loadingData) {
    return (
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <div
        style={{ display: "flex", justifyContent: "end", alignItems: "center" }}
      >
        <Tooltip title="Create New">
          <IconButton onClick={handleCreate}>
            <CreateNewFolderIcon />
          </IconButton>
        </Tooltip>
        {selectedRow > -1 ? (
          <div>
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <div>Selected row</div>
        )}
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, marginTop: 1 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell align="right">Title</StyledTableCell>
              <StyledTableCell align="right">Release Year</StyledTableCell>
              <StyledTableCell align="right">Author</StyledTableCell>
              <StyledTableCell align="right">Publisher</StyledTableCell>
              <StyledTableCell align="right">Age Category</StyledTableCell>
              <StyledTableCell align="right">Rating</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataBooks.map((row) => (
              <StyledTableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  backgroundColor: "#42a5f5"
                }}
                selected={isSelected(row.id)}
                onClick={() => {
                  row.id !== selectedRow
                    ? setSelectedRow(row.id)
                    : setSelectedRow(-1);
                }}
              >
                <StyledTableCell>{row.id}</StyledTableCell>
                <StyledTableCell align="right">{row.title}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.releaseDate}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {
                    authorsData.find((e) => {
                      return e.id === row.authorId;
                    }).fullName
                  }
                </StyledTableCell>
                <StyledTableCell align="right">{row.publisher}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.ageCategory}+
                </StyledTableCell>
                <StyledTableCell align="right">{row.rating}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
