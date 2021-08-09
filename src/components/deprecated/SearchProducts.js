import React, { useState } from "react";
import Downshift, { resetIdCounter } from "downshift";
import debounce from "lodash.debounce";
import { makeStyles } from "@material-ui/core/styles";

const SearchProducts = (props) => {
  const { productos } = props;
  const [searchedItems, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchText = debounce((e) => {
    setLoading({ loading: true });
    let items_res = productos.filter((item) =>
      item.nombre.toUpperCase().includes(e.target.value.toUpperCase()));
    setItems(items_res);
    setLoading(false);
  }, 350);
  resetIdCounter();
  
  const useStyles = makeStyles((theme) => ({
    searchInput: {
      width: "95%",
      padding: "10px",
      border: 0,
      fontSize: "2rem",
      writingMode: "horizontal-tb",
      textRendering: "auto",
      color: "-internal-light-dark-color(black, white)",
      letterSpacing: "normal",
      wordSpacing: "normal",
      textTransform: "none",
      textIndent: "0px",
      textShadow: "none",
      display: "inline-block",
      textAlign: "start",
      backgroundColor: "-internal-light-dark-color(white, black)",
      cursor: "text",
      margin: "0em",
      font: "400 11px system-ui",
    },
    dropDown: {
      position: "absolute",
      width: "90%",
      zIndex: 100,
      border: "1px solid lightgray",
    },
    dropDownItem: {
      borderBottom: "1px solid lightgrey",
      background: "white",
      padding: "1rem",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      borderLeft: "10px solid white",
      "&:hover": {
        paddingLeft: "2rem",
        borderLeft: "10px solid lightgrey",
      },
    },
  }));
  const classes = useStyles();

  return (
    <Downshift
      onChange={(e) => goToItem(e)}
      itemToString={(item) => (item === null ? "" : item.nombre)}
    >
      {({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        highlightedIndex,
      }) => (
        <div>
          <input
            {...getInputProps({
              type: "text",
              placeholder: "Add Product",
              id: "searchProducto",
              className: classes.searchInput,
              onChange: (e) => {
                e.persist();
                searchText(e);
              },
            })}
          />
          {isOpen && !loading && (
            <div className={classes.dropDown}>
              {searchedItems.map((item, index) => (
                <div
                  className={classes.dropDownItem}
                  {...getItemProps({ item })}
                  key={item.id}
                >
                  {item.nombre}
                </div>
              ))}
              {!searchedItems.length && !loading && (
                <div className={classes.dropDownItem}>
                  Nothing Found For {inputValue}{" "}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
};

export default SearchProducts;
