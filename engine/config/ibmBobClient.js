const axios = require('axios');

const ibmBobClient = {
  scan: async (options) => {
    const response = await axios.post(
      process.env.IBM_BOB_API_URL || 'https://api.ibm.com/bob/v1/scan',
      options,
      {
        headers: {
          'Authorization': `Bearer ${process.env.IBM_BOB_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }
};

module.exports = ibmBobClient;


