import axios from "axios";

const apiUrl = process.env.REACT_APP_URL_API;

//===================== COMPANY
export const getCompany = (id) => {
  return axios.get(`${apiUrl}companies/${id}`)
    .then((res) => { return res.data; })
    .catch((err) => { return err; });
};

export const getCampaignsForCompany = (id) => {
  return axios.get(`${apiUrl}companies/${id}`)
    .then((res) => { return res.data.campaigns; })
    .catch((err) => { return err; });
};

//===================== CAMPAIGNS
export const getCampaigns = (id) => {
  return axios.get(`${apiUrl}companies/campaign/${id}`)
    .then((res) => { return res.data; })
    .catch((error) => { return error; });
};

export const getCampaign = (id) => {
  return axios.get(`${apiUrl}campaign/${id}`)
    .then((res) => { return res.data; })
    .catch((error) => { return error; });
};

export const updateCampaign = (id, newData) => {
  return axios.post(`${apiUrl}campaign/update/${id}`, {
      banner: {
        image: newData.bannerImage || null,
        text: newData.bannerText || null,
      },
      avatar: newData.avatar || null,
      fontColor: newData.fontColor,
      headerColor: newData.headerColor,
      loadText: newData.loadText || null,
      welcomeText: {
        text: newData.welcomeText || "Bienvenido",
        size: newData.welcomeSize || 18,
      },
      name: newData.name,
      typeLogin: parseInt(newData.typeLogin) || 2,
      backgroundImage: newData.backgroundImage || null,
      backgroundColor: newData.backgroundColor || "#fff",
      tiempoEspera: parseInt(newData.tiempoEspera) || 2,
      horarios: {
        diasSemana: newData.diasSemana,
        semana: newData.hSemana,
        sabado: newData.hSabado,
        domingo: newData.hDomingo,
        zonaHoraria: newData.zonaHoraria || 'America/Argentina/Buenos_Aires'
      },
      cantidadClientes: newData.cantidadClientes || 2
    }).then(res => { return res.data; })
    .catch(err => { return err; })
};

export const getResourses = (uid) => {
  return axios.get(`${apiUrl}resource/${uid}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then(res => { return res.data; })
    .catch(error => { return error; });
};

export const addResource = (newData, id) => {
  return axios.post(`${apiUrl}resource/`, {
      idCampaign: id,
      name: newData.name,
      type: parseInt(newData.type) || 0,
      recurso: newData.content,
    }).then(res =>{ return res.data; })
    .catch(err =>{ return err; });
};

export const removeResource = (campId, resId) => {
  return axios.delete(`${apiUrl}resource/`, {
      data: {
        campaignId: campId,
        resourceId: resId,
      },
    }).then(res => { return res.data; })
    .catch(err => { return err; });
};

export const updateResource = (oldData, id) => {
  return axios.post(`${apiUrl}resource/update`, {
      idCampaign: id,
      resourceId: oldData.id,
      name: oldData.name,
      recurso: oldData.content,
      type: parseInt(oldData.type),
    }).then(res => { return res.data; })
    .catch(err => { return err; });
};

export const getChats = (uid) => {
  return axios.get(`${apiUrl}stats/listCharlasUser/${uid}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then(res => { return res.data })
    .catch(error => { return error; });
};

export const getSessions = (uid) => {
  return axios.get(`${apiUrl}stats/listSessionUser/${uid}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then(res => { return res.data; })
    .catch(error => { return error; });
};

export const getServices = (uid) => {
  return axios.get(`${apiUrl}stats/levelofservice/${uid}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then(res => { return res.data; })
    .catch(error => { return error; });
};

export const getNonClients = (idCamp) => {
  return axios.get(`${apiUrl}campaign/marked/${idCamp}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then(res => { return res.data; })
    .catch(error => { return error; });
};

//========================USERS
//========================SELLERS
export const getSeller = (id) => {
  return axios.get(`${apiUrl}users/user/${id}`)
    .then((res) => { return res.data; })
    .catch((error) => { return error; });
};

export const getSellers = (id) => {
  return axios.get(`${apiUrl}users/seller-list/list `)
    .then(res => {
      let data = [];
      res.data.forEach((seller) => {
        if (seller.idcompany === id) data.push(seller);
      });
      return data;
    })
    .catch(error => { return error; });
};

export const addSellerToCampaign = (campId, userId) => {
  return axios.post(`${apiUrl}campaign/assign/`, {
      campaignId: campId,
      userId: userId,
    }).then(res => { return res; })
    .catch(error => { return error; });
};

export const removeSellerToCampaign = (oldData, id) => {
  return axios.delete(`${apiUrl}campaign/assign`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    data: {
      campaignId: oldData.id,
      campaignNps: oldData.nps,
      name: oldData.name,
      userId: id,
    }
  }).then(res => { return res.data; })
  .catch(error => { return error; });
};

//========================ADMINS
export const getClients = (id) => {
  return axios.get(`${apiUrl}users/clients/list/${id}`)
    .then((res) => {
      const data = [];
      res.data.forEach((element) => {
        if (element.idcompany === id) data.push(element);
      });
      return data;
    })
    .catch((error) => { return error; });
};

export const getAdmins = (id) => {
  return axios.get(`${apiUrl}users/admin-list/list`)
    .then((res) => {
      const data = [];
      res.data.forEach((element) => {
        if (element.idcompany === id) data.push(element);
      });
      return data;
    })
    .catch((error) => { return error; });
};

//========================REGULAR USERS
export const getUser = (uid) => {
  return axios.get(`${apiUrl}users/user/${uid}`, {
      headers: { "Access-Control-Allow-Origin": "*" },
    }).then(res => { return res.data; })
    .catch(error => { return error; });
};

export const postUser = (newData) => {
  return axios.post(`${apiUrl}users`, {
        avatar: newData.avatar,
        mail: newData.mail,
        password: newData.password,
        name: newData.name,
        displayName: newData.name,
        role: newData.role || 'seller',
        admin: newData.admin || false,
        idcompany: newData.idcompany,
      },{
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
    }).then(res => { return res.data; })
    .catch( err => { return err; });
};

export const updateUser = (newData) => {
  return axios.post(`${apiUrl}users/edit`, {
      photoURL: newData.photoURL,
			mail: newData.mail,
			uid: newData.uid,
      name: newData.name,
      displayName: newData.name,
			admin: false || newData.admin,
			role: newData.role || 'seller',
			nps: newData.nps || 0,
      }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(res => { return res.data; })
    .catch(error => { return error; });
};

export const deleteUser = (uid) => {
  return axios.delete(`${apiUrl}users/${uid}`)
    .then(res => { return res.data })
    .catch(err => { return err });
}

export const updatePass = (newData) => {
  return axios.post(`${apiUrl}users/update-password`,{
      password: newData.password,
      uid: newData.uid,
    }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    }).then(res => { return res.data })
    .catch(err => { return err });
};