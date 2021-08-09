import React from "react";
import { Link } from 'react-router-dom';

const BreadCrumbs = (props) => {
  return (
    <div style={ breadStyle }> 
        { props.route.map((rut, ind) => (
            (ind !== (props.route.length - 1))
                ? <span key={ind}>
                    <Link to={{
                        pathname: '/',
                        search: "",
                        hash: "",
                        state: (rut === 'Home')
                            ? { to: "/" }
                            : { to: rut.toLowerCase() },
                    }}>{ rut }</Link>
                    &nbsp; { '/' } &nbsp;
                </span>
                : rut
        )) }
    </div>
  );
};

const breadStyle = {
    fontSize: '12px',
    fontWeight: 'bolder',
    marginBottom: '2rem'
};

export default BreadCrumbs;