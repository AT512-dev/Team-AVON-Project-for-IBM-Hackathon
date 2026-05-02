/**
 * IBM WatsonX AI Client
 * Connects to IBM Cloud WatsonX for AI-powered security analysis
 *
 * @module ibmBobClient
 * @author Team AVON
 */

'use strict';

require('dotenv').config();
const axios = require('axios');

/**
 * IBM WatsonX Client Configuration
 */
class IBMWatsonXClient {
  constructor() {
    this.apiKey = process.env.IBM_CLOUD_API_KEY;
    this.projectId = process.env.WATSONX_PROJECT_ID;
    this.url = process.env.IBM_CLOUD_URL || 'https://us-south.ml.cloud.ibm.com';
    this.modelId = process.env.MODEL_ID || 'ibm/granite-13b-chat-v2';
    this.accessToken = null;
    this.tokenExpiry = null;

    // FAIL-FAST: Check for required API key at initialization
    if (!this.apiKey) {
      console.error('[IBM] FATAL ERROR: IBM_CLOUD_API_KEY is not set in environment variables');
      console.error('[IBM] Please set IBM_CLOUD_API_KEY in your .env file');
      console.error('[IBM] Example: IBM_CLOUD_API_KEY=your_api_key_here');
      process.exit(1);
    }
  }

  /**
   * Get IBM Cloud IAM access token
   * @returns {Promise<String>} Access token
   */
  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        'https://iam.cloud.ibm.com/identity/token',
        new URLSearchParams({
          grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
          apikey: this.apiKey
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Token expires in 1 hour, refresh 5 minutes before
      this.tokenExpiry = Date.now() + (55 * 60 * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('[IBM] Failed to get access token:', error.message);
      throw new Error('Failed to authenticate with IBM Cloud');
    }
  }

  /**
   * Send prompt to WatsonX AI model
   * @param {Object} options - Scan options
   * @returns {Promise<Object>} AI response
   */
  async scan(options) {
    if (!this.apiKey || !this.projectId) {
      throw new Error('IBM Cloud credentials not configured. Please set IBM_CLOUD_API_KEY and WATSONX_PROJECT_ID in .env file');
    }

    try {
      const token = await this.getAccessToken();

      const payload = {
        model_id: this.modelId,
        input: options.prompt || options.task,
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: options.options?.max_tokens || 2000,
          temperature: options.options?.temperature || 0.3,
          repetition_penalty: 1.1
        },
        project_id: this.projectId
      };

      const response = await axios.post(
        `${this.url}/ml/v1/text/generation?version=2023-05-29`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 60000 // 60 second timeout
        }
      );

      return {
        success: true,
        data: response.data.results?.[0]?.generated_text || response.data,
        model: this.modelId,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('[IBM] WatsonX API error:', error.response?.data || error.message);
      
      // Return fallback response instead of crashing
      return {
        success: false,
        error: error.message,
        fallback: true,
        message: 'IBM WatsonX API unavailable, using static analysis only'
      };
    }
  }

  /**
   * Test connection to IBM WatsonX
   * @returns {Promise<Boolean>} Connection status
   */
  async testConnection() {
    try {
      const token = await this.getAccessToken();
      console.log('[IBM] Successfully authenticated with IBM Cloud');
      console.log('[IBM] Project ID:', this.projectId);
      console.log('[IBM] Model:', this.modelId);
      console.log('[IBM] Region:', this.url);
      return true;
    } catch (error) {
      console.error('[IBM] Connection test failed:', error.message);
      return false;
    }
  }
}

// Export singleton instance
const ibmBobClient = new IBMWatsonXClient();

module.exports = ibmBobClient;
