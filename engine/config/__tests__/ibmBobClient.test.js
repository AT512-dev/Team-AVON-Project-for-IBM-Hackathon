/**
 * IBM BOB CLIENT TESTS
 * Tests for IBM WatsonX AI Client integration
 * Uses mocks since we don't have actual API credentials
 * Following TDD principles - testing behavior through public interfaces
 * 
 * @author Bob - Team AVON Testing Suite
 */

'use strict';

const axios = require('axios');
const IBMWatsonXClient = require('../ibmBobClient');

// Mock axios
jest.mock('axios');

describe('IBM WatsonX Client', () => {
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Store original env vars
    const originalEnv = { ...process.env };
    
    // Reset environment variables for testing
    process.env.IBM_CLOUD_API_KEY = 'test-api-key';
    process.env.WATSONX_PROJECT_ID = 'test-project-id';
    process.env.IBM_CLOUD_URL = 'https://test.ml.cloud.ibm.com';
    process.env.MODEL_ID = 'ibm/granite-13b-chat-v2';
    
    // Reset client token cache
    IBMWatsonXClient.accessToken = null;
    IBMWatsonXClient.tokenExpiry = null;
    IBMWatsonXClient.apiKey = 'test-api-key';
    IBMWatsonXClient.projectId = 'test-project-id';
    IBMWatsonXClient.url = 'https://test.ml.cloud.ibm.com';
    IBMWatsonXClient.modelId = 'ibm/granite-13b-chat-v2';
  });

  describe('Configuration', () => {
    test('should initialize with environment variables', () => {
      expect(IBMWatsonXClient.apiKey).toBe('test-api-key');
      expect(IBMWatsonXClient.projectId).toBe('test-project-id');
      expect(IBMWatsonXClient.url).toBe('https://test.ml.cloud.ibm.com');
      expect(IBMWatsonXClient.modelId).toBe('ibm/granite-13b-chat-v2');
    });

    test('should use default URL if not provided', () => {
      delete process.env.IBM_CLOUD_URL;
      const client = new (require('../ibmBobClient').constructor)();
      expect(client.url).toBe('https://us-south.ml.cloud.ibm.com');
    });

    test('should use default model if not provided', () => {
      delete process.env.MODEL_ID;
      const client = new (require('../ibmBobClient').constructor)();
      expect(client.modelId).toBe('ibm/granite-13b-chat-v2');
    });
  });

  describe('getAccessToken', () => {
    test('should fetch new access token from IBM Cloud', async () => {
      const mockToken = 'mock-access-token-12345';
      axios.post.mockResolvedValue({
        data: {
          access_token: mockToken,
          expires_in: 3600
        }
      });

      const token = await IBMWatsonXClient.getAccessToken();

      expect(token).toBe(mockToken);
      expect(axios.post).toHaveBeenCalledWith(
        'https://iam.cloud.ibm.com/identity/token',
        expect.any(URLSearchParams),
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          }
        })
      );
    });

    test('should cache access token', async () => {
      const mockToken = 'cached-token';
      axios.post.mockResolvedValue({
        data: { access_token: mockToken }
      });

      // First call - should fetch
      await IBMWatsonXClient.getAccessToken();
      expect(axios.post).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const token = await IBMWatsonXClient.getAccessToken();
      expect(token).toBe(mockToken);
      expect(axios.post).toHaveBeenCalledTimes(1); // Still 1, not 2
    });

    test('should refresh token when expired', async () => {
      const oldToken = 'old-token';
      const newToken = 'new-token';
      
      axios.post
        .mockResolvedValueOnce({ data: { access_token: oldToken } })
        .mockResolvedValueOnce({ data: { access_token: newToken } });

      // First call
      await IBMWatsonXClient.getAccessToken();
      
      // Simulate token expiry
      IBMWatsonXClient.tokenExpiry = Date.now() - 1000;
      
      // Second call should fetch new token
      const token = await IBMWatsonXClient.getAccessToken();
      expect(token).toBe(newToken);
      expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('should throw error on authentication failure', async () => {
      axios.post.mockRejectedValue(new Error('Invalid API key'));

      await expect(IBMWatsonXClient.getAccessToken())
        .rejects
        .toThrow('Failed to authenticate with IBM Cloud');
    });
  });

  describe('scan', () => {
    beforeEach(() => {
      // Mock successful token fetch
      axios.post.mockResolvedValue({
        data: { access_token: 'test-token' }
      });
    });

    test('should send prompt to WatsonX and return response', async () => {
      const mockResponse = {
        results: [{
          generated_text: 'AI analysis result'
        }]
      };

      axios.post
        .mockResolvedValueOnce({ data: { access_token: 'test-token' } })
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await IBMWatsonXClient.scan({
        prompt: 'Analyze this code',
        options: { max_tokens: 1000, temperature: 0.3 }
      });

      expect(result.success).toBe(true);
      expect(result.data).toBe('AI analysis result');
      expect(result.model).toBe('ibm/granite-13b-chat-v2');
      expect(result.timestamp).toBeDefined();
    });

    test('should include correct parameters in API call', async () => {
      axios.post
        .mockResolvedValueOnce({ data: { access_token: 'test-token' } })
        .mockResolvedValueOnce({ data: { results: [{ generated_text: 'result' }] } });

      await IBMWatsonXClient.scan({
        prompt: 'Test prompt',
        options: { max_tokens: 2000, temperature: 0.5 }
      });

      const apiCall = axios.post.mock.calls[1];
      expect(apiCall[0]).toContain('/ml/v1/text/generation');
      expect(apiCall[1]).toMatchObject({
        model_id: 'ibm/granite-13b-chat-v2',
        input: 'Test prompt',
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: 2000,
          temperature: 0.5,
          repetition_penalty: 1.1
        },
        project_id: 'test-project-id'
      });
    });

    test('should use default parameters if not provided', async () => {
      axios.post
        .mockResolvedValueOnce({ data: { access_token: 'test-token' } })
        .mockResolvedValueOnce({ data: { results: [{ generated_text: 'result' }] } });

      await IBMWatsonXClient.scan({ prompt: 'Test' });

      const apiCall = axios.post.mock.calls[1];
      expect(apiCall[1].parameters.max_new_tokens).toBe(2000);
      expect(apiCall[1].parameters.temperature).toBe(0.3);
    });

    test('should throw error if credentials not configured', async () => {
      delete process.env.IBM_CLOUD_API_KEY;
      const client = new (require('../ibmBobClient').constructor)();

      await expect(client.scan({ prompt: 'Test' }))
        .rejects
        .toThrow('IBM Cloud credentials not configured');
    });

    test('should return fallback response on API error', async () => {
      axios.post
        .mockResolvedValueOnce({ data: { access_token: 'test-token' } })
        .mockRejectedValueOnce(new Error('API unavailable'));

      const result = await IBMWatsonXClient.scan({ prompt: 'Test' });

      expect(result.success).toBe(false);
      expect(result.fallback).toBe(true);
      expect(result.message).toContain('IBM WatsonX API unavailable');
    });

    test('should handle timeout errors gracefully', async () => {
      axios.post
        .mockResolvedValueOnce({ data: { access_token: 'test-token' } })
        .mockRejectedValueOnce({ code: 'ECONNABORTED', message: 'timeout' });

      const result = await IBMWatsonXClient.scan({ prompt: 'Test' });

      expect(result.success).toBe(false);
      expect(result.fallback).toBe(true);
    });
  });

  describe('testConnection', () => {
    test('should return true on successful connection', async () => {
      axios.post.mockResolvedValue({
        data: { access_token: 'test-token' }
      });

      const result = await IBMWatsonXClient.testConnection();

      expect(result).toBe(true);
    });

    test('should return false on connection failure', async () => {
      axios.post.mockRejectedValue(new Error('Connection failed'));

      const result = await IBMWatsonXClient.testConnection();

      expect(result).toBe(false);
    });

    test('should log connection details on success', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      axios.post.mockResolvedValue({
        data: { access_token: 'test-token' }
      });

      await IBMWatsonXClient.testConnection();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[IBM] Successfully authenticated')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      axios.post.mockRejectedValue({ code: 'ENETUNREACH' });

      await expect(IBMWatsonXClient.getAccessToken())
        .rejects
        .toThrow('Failed to authenticate with IBM Cloud');
    });

    test('should handle invalid response format', async () => {
      axios.post
        .mockResolvedValueOnce({ data: { access_token: 'test-token' } })
        .mockResolvedValueOnce({ data: {} }); // Missing results

      const result = await IBMWatsonXClient.scan({ prompt: 'Test' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({}); // Should handle gracefully
    });
  });

  describe('Integration Scenarios', () => {
    test('should handle complete scan workflow', async () => {
      // Mock token fetch
      axios.post.mockResolvedValueOnce({
        data: { access_token: 'workflow-token' }
      });

      // Mock scan response
      axios.post.mockResolvedValueOnce({
        data: {
          results: [{
            generated_text: 'Vulnerability found: SQL injection in line 42'
          }]
        }
      });

      const result = await IBMWatsonXClient.scan({
        task: 'security_analysis',
        prompt: 'Analyze code for vulnerabilities',
        options: { temperature: 0.2, max_tokens: 3000 }
      });

      expect(result.success).toBe(true);
      expect(result.data).toContain('SQL injection');
      expect(axios.post).toHaveBeenCalledTimes(2);
    });

    test('should handle multiple scans with token caching', async () => {
      axios.post
        .mockResolvedValueOnce({ data: { access_token: 'cached-token' } })
        .mockResolvedValue({ data: { results: [{ generated_text: 'result' }] } });

      // First scan
      await IBMWatsonXClient.scan({ prompt: 'Scan 1' });
      
      // Second scan - should reuse token
      await IBMWatsonXClient.scan({ prompt: 'Scan 2' });

      // Should only fetch token once
      const tokenCalls = axios.post.mock.calls.filter(
        call => call[0].includes('iam.cloud.ibm.com')
      );
      expect(tokenCalls).toHaveLength(1);
    });
  });
});

// Made with Bob