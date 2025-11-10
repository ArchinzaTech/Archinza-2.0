const NodeCache = require("node-cache");
const axios = require("axios");

class PincodeCache {
  constructor() {
    this.dataCache = new NodeCache({
      stdTTL: 24 * 60 * 60,
      checkperiod: 120,
    });

    this.refreshStatusCache = new NodeCache({
      stdTTL: 60,
      checkperiod: 30,
    });
  }

  isRefreshing(pincode) {
    return !!this.refreshStatusCache.get(`refreshing_${pincode}`);
  }

  getCachedData(pincode) {
    return this.dataCache.get(pincode);
  }

  async fetchPincodeData(pincode) {
    if (this.isRefreshing(pincode)) {
      return null;
    }

    try {
      // Mark as currently refreshing
      this.refreshStatusCache.set(`refreshing_${pincode}`, true);

      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`,
        {
          timeout: 7000,
        }
      );

      if (response.status === 200) {
        this.dataCache.set(pincode, response.data);
        return response.data;
      }
    } catch (error) {
      console.error(`Pincode API Error for ${pincode}:`, error.message);
    } finally {
      this.refreshStatusCache.del(`refreshing_${pincode}`);
    }

    return null;
  }

  // Main method to get pincode data
  async getPincodeData(pincode) {
    let pincodeData = this.getCachedData(pincode);

    if (!pincodeData) {
      pincodeData = await this.fetchPincodeData(pincode);
    }

    return pincodeData;
  }

  backgroundRefresh(pincode) {
    setImmediate(async () => {
      await this.fetchPincodeData(pincode);
    });
  }
}

module.exports = new PincodeCache();
