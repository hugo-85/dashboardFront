//==========================PRODUCTOS
export const getProducts = () => {
    return axios.get(`${apiUrl}/products`)
      .then(res => { return res.data })
      .catch(err => { return err });
};
  
export const addProduct = (newData) => {
    return axios.post(`${apiUrl}/products/`, {
            productName: newData.productName,
            color: newData.color,
            version: newData.version,
        }).then(res => {
            return res.data;
        }).catch(err => {
            return err;
        });
};
  
export const deleteProduct = (id) => {
    return axios.delete(`${apiUrl}/products/${id}`)
        .then(res => { return res.data })
        .catch(err => { return err });
}

//===========================CAMPAIGNS
export const getSellersForCampaign = async (id) => {
    return axios
        .get(`${apiUrl}users/listUsers/Campaign/${id}`)
        .then(res => { return res.data; })
        .catch(error => { return error; });
};

//===========================SELLERS
export const getSellerCampaigns = (id) => {
    return axios.get(`${apiUrl}campaign/userCampaigns/${id}`)
        .then(res => { return res.data })
        .catch((error) => { return error; });
};

//===========================USERS
export const getUsersCampaign = (id) => {
    return axios.get(`${apiUrl}users/listUsers/Campaign/${id}`, {
            headers: { "Access-Control-Allow-Origin": "*" },
        }).then(res => { return res.data; })
        .catch(error => { return error; });
};