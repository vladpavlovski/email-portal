const axios = require('axios');
const https = require('https');

class DirectAdminService {
  constructor() {
    this.baseURL = process.env.DIRECTADMIN_URL;
    this.username = process.env.DIRECTADMIN_USERNAME;
    this.password = process.env.DIRECTADMIN_PASSWORD;
    
    // Create axios instance with basic configuration
    this.client = axios.create({
      baseURL: this.baseURL,
      auth: {
        username: this.username,
        password: this.password
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // For self-signed certificates
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  // Create a new email account
  async createEmailAccount(username, domain, password, quota = 1024) {
    try {
      const params = new URLSearchParams({
        action: 'create',
        domain: domain,
        user: username,
        passwd: password,
        passwd2: password,
        quota: quota,
        limit: 'unlimited',
        send_limit: 'unlimited'
      });

      const response = await this.client.post('/CMD_API_POP', params.toString());
      
      // DirectAdmin returns text response, need to parse it
      const result = this.parseDirectAdminResponse(response.data);
      
      if (result.error === '0') {
        return {
          success: true,
          message: 'Email account created successfully',
          data: {
            email: `${username}@${domain}`,
            quota: quota
          }
        };
      } else {
        throw new Error(result.text || result.details || 'Failed to create email account');
      }
    } catch (error) {
      console.error('DirectAdmin API Error:', error);
      
      if (error.response) {
        const parsed = this.parseDirectAdminResponse(error.response.data);
        throw new Error(parsed.text || parsed.details || 'DirectAdmin API error');
      }
      
      throw new Error(error.message || 'Failed to connect to DirectAdmin');
    }
  }

  // Check if email account exists
  async checkEmailExists(username, domain) {
    try {
      const params = new URLSearchParams({
        action: 'list',
        domain: domain
      });

      const response = await this.client.post('/CMD_API_POP', params.toString());
      const result = this.parseDirectAdminResponse(response.data);
      
      if (result.error === '0' && result.list) {
        const emailList = Array.isArray(result.list) ? result.list : [result.list];
        return emailList.includes(username);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking email existence:', error);
      return false;
    }
  }

  // Delete email account
  async deleteEmailAccount(username, domain) {
    try {
      const params = new URLSearchParams({
        action: 'delete',
        domain: domain,
        user: username
      });

      const response = await this.client.post('/CMD_API_POP', params.toString());
      const result = this.parseDirectAdminResponse(response.data);
      
      if (result.error === '0') {
        return {
          success: true,
          message: 'Email account deleted successfully'
        };
      } else {
        throw new Error(result.text || result.details || 'Failed to delete email account');
      }
    } catch (error) {
      console.error('DirectAdmin API Error:', error);
      throw new Error(error.message || 'Failed to delete email account');
    }
  }

  // Parse DirectAdmin response (it returns URL-encoded format)
  parseDirectAdminResponse(data) {
    if (typeof data !== 'string') {
      return data;
    }

    const result = {};
    const lines = data.split('&');
    
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value !== undefined) {
        result[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
    
    return result;
  }

  // Test connection to DirectAdmin
  async testConnection() {
    try {
      const response = await this.client.get('/CMD_API_SHOW_USER_CONFIG');
      return {
        success: true,
        message: 'Connected to DirectAdmin successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to connect to DirectAdmin',
        error: error.message
      };
    }
  }
}

module.exports = new DirectAdminService();