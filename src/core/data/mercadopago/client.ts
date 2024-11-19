import axios from 'axios';

const mercadopagoClient = axios.create({
  baseURL: process.env.MERCADOPAGO_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
  },
});

export default mercadopagoClient;
