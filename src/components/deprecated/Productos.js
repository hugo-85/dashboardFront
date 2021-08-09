import React, { useEffect, useState } from "react";
import { Container, makeStyles } from "@material-ui/core";
import MaterialTable from "material-table";
import { getProducts, addProduct, deleteProduct } from '../../middleware/Middleware'

const Productos = (props) => {
  const [prods, setProds] = useState([]);

  useEffect(() => {
    if (prods.length === 0) 
      getProducts().then(res => setProds(res.data));
  }, [prods]);

  const useStyles = makeStyles((theme) => ({
    productosTable: {
      marginTop: "40px",
    },
  }));
  const classes = useStyles();

  return (
    <Container className={classes.productosTable}>
      <MaterialTable
        title="Products"
        columns={[
          {
            title: "Name",
            field: "productName",
            editable: "always",
            headerStyle: {
              width: "25%",
              textAlign: "center",
            },
          },
          {
            title: "Photo",
            field: "foto",
            editable: "always",
            editComponent: (props) => (
              <input
                type="file"
                onChange={(e) => props.onChange(e.target.value)}
              />
            ),
            render: (rowData) => (
              <img
                src={"./imgs/phone.png"}
                alt="producto"
                style={{ width: 50, borderRadius: "50%" }}
              />
            ),
            headerStyle: {
              width: "25%",
            },
          },
          {
            title: "Version",
            field: "version",
            editable: "always",
            headerStyle: {
              width: "25%",
            },
          },
          {
            title: "Url",
            field: "url",
            editable: "always",
            headerStyle: {
              width: "25%",
            },
          },
          {
            title: "Color",
            field: "color",
            editable: "always",
            headerStyle: {
              width: "25%",
            },
          },
        ]}
        data={prods}
        editable={{
          onRowAdd: (newData) =>
            addProduct({
              productName: newData.productName,
              color: newData.color,
              version: newData.version,
            }).then(res =>
              setProds([ ...prods, {
                productName: newData.productName,
                color: newData.color,
                version: newData.version,
              }])
            ),
          onRowDelete: (oldData) =>
            deleteProduct(oldData.id).then(res => 
              setProds(prods.filter((p) => p.productName !== oldData.productName))
            ),
        }}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20]
        }}
      />
    </Container>
  );
};

export default Productos;
