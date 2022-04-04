import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { variables } from "./variables";
import { useHistory } from "react-router-dom";

export default function PostPutForm(props) {
  const id = props.match.params.id;
  const [author, setAuthor] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [release, setRelease] = React.useState("");
  const [publisher, setPublisher] = React.useState("");
  const [rating, setRating] = React.useState("");
  const [ageCategory, setAgeCategory] = React.useState("");
  const [authorsData, setAuthorsData] = React.useState([]);
  const [bookData, setBookData] = React.useState({});
  const [loadingData, setloadingData] = React.useState(true);
  const token = sessionStorage.getItem(variables.tokenKey);

  const handleChangeAuthor = (event) => {
    setAuthor(event.target.value);
  };
  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  };
  const handleChangeRelease = (event) => {
    setRelease(event.target.value);
  };
  const handleChangePublisher = (event) => {
    setPublisher(event.target.value);
  };
  const handleChangeRating = (event) => {
    setRating(event.target.value);
  };
  const handleChangeCategory = (event) => {
    setAgeCategory(event.target.value);
  };
  const handlerSubmit = async (event) => {
    if (id === "-1")
      PostDataBook(title, release, publisher, ageCategory, rating, author);
    else
      PutDataBook(id, title, release, publisher, ageCategory, rating, author);
    history.push("/books");
  };

  async function getDataAuthors() {
    const response = await fetch(variables.API_URL + "api/BooksApi/Authors", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
        credentials: "include"
      }
    });
    const dataFromDb = await response.json();
    setAuthorsData(dataFromDb);
  }

  async function GetDataBook(id) {
    if (id === "-1") {
      return;
    }
    fetch(variables.API_URL + "api/BooksApi/Books/" + id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
        credentials: "include"
      }
    })
      .then((response) => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (book) {
          console.log(book);
          setBookData(book);
          setAuthor(book.authorId);
          setTitle(book.title);
          setRelease(book.releaseDate);
          setPublisher(book.publisher);
          setRating(book.rating);
          setAgeCategory(book.ageCategory);
        });
      })
      .catch((err) =>
        console.log("Request Failed", err, err.status, err.statusText)
      ); // Catch errors
  }

  async function PostDataBook(
    titleBook,
    releaseDateBook,
    publisherBook,
    ageCategoryBook,
    ratingBook,
    authorBookId
  ) {
    await fetch(variables.API_URL + "api/BooksApi/Books", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
        credentials: "include"
      },
      body: JSON.stringify({
        title: titleBook,
        releaseDate: parseInt(releaseDateBook, 10),
        publisher: publisherBook,
        ageCategory: parseInt(ageCategoryBook, 10),
        rating: parseFloat(ratingBook),
        authorId: parseInt(authorBookId, 10)
      })
    })
      .then((response) => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (book) {
          console.log(book);
          setBookData(book);
        });
      })
      .catch((err) =>
        console.log("Request Failed", err, err.status, err.statusText)
      ); // Catch errors
  }

  // Изменение
  async function PutDataBook(
    idBook,
    titleBook,
    releaseDateBook,
    publisherBook,
    ageCategoryBook,
    ratingBook,
    authorBookId
  ) {
    await fetch(variables.API_URL + "api/BooksApi/Books/" + idBook, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        mode: "cors",
        credentials: "include"
      },
      body: JSON.stringify({
        id: parseInt(idBook, 10),
        title: titleBook,
        releaseDate: parseInt(releaseDateBook, 10),
        publisher: publisherBook,
        ageCategory: parseInt(ageCategoryBook, 10),
        rating: parseFloat(ratingBook),
        authorId: parseInt(authorBookId, 10)
      })
    })
      .then((response) => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then(function (book) {
          console.log(book);
          setBookData(book);
        });
      })
      .catch((err) =>
        console.log("Request Failed", err, err.status, err.statusText)
      ); // Catch errors
  }

  let history = useHistory();

  React.useEffect(() => {
    getDataAuthors();
    GetDataBook(id);
    setloadingData(false);
  }, [id]);

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
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" }
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="Title"
        value={title}
        label="Title"
        variant="outlined"
        onChange={handleChangeTitle}
      />
      <TextField
        id="Release"
        value={release}
        label="Release year"
        variant="outlined"
        onChange={handleChangeRelease}
      />
      <TextField
        id="Publisher"
        value={publisher}
        label="Publisher"
        variant="outlined"
        onChange={handleChangePublisher}
      />
      <TextField
        id="Rating"
        value={rating}
        label="Rating"
        variant="outlined"
        onChange={handleChangeRating}
      />
      <TextField
        id="AgeCategory"
        value={ageCategory}
        label="Age Category"
        variant="outlined"
        onChange={handleChangeCategory}
      />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-standard-label">Author</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={author}
          label="Age"
          onChange={handleChangeAuthor}
        >
          {authorsData.map((item) => {
            return (
              <MenuItem selected={item.id === id} key={item.id} value={item.id}>
                {item.fullName}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Button variant="contained" color="success" onClick={handlerSubmit}>
        Save
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={(event) => {
          history.push("/books");
        }}
      >
        Cancel
      </Button>
    </Box>
  );
}
