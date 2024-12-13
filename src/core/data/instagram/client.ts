import axios from 'axios';

const instagramClient = axios.create({
  baseURL: `https://${process.env.INSTAGRAM_GRAPH_API_DOMAIN}/${process.env.INSTAGRAM_GRAPH_API_VERSION}`,
  headers: {
    Authorization: `Bearer ${process.env.INSTAGRAM_GRAPH_API_ACCESS_TOKEN}`,
  },
});

export default instagramClient;
