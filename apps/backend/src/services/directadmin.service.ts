import axios from 'axios';
import { config } from '../config/config';
import crypto from 'crypto';

export interface DirectAdminEmailData {
  user: string;
  domain: string;
  password: string;
  quota: number;
}

export class DirectAdminService {
  private apiUrl: string;
  private username: string;
  private password: string;

  constructor() {
    this.apiUrl = config.directAdmin.url;
    this.username = config.directAdmin.username;
    this.password = config.directAdmin.password;
  }

  /**
   * Generate a secure random password
   */
  static generateSecurePassword(length = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    
    // Ensure at least one of each type
    password += 'A'; // uppercase
    password += 'a'; // lowercase
    password += '1'; // number
    password += '!'; // special char
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Create an email account in DirectAdmin
   */
  async createEmailAccount(data: DirectAdminEmailData): Promise<void> {
    try {
      const params = new URLSearchParams({
        action: 'create',
        domain: data.domain,
        user: data.user,
        passwd: data.password,
        passwd2: data.password,
        quota: data.quota.toString(),
        limit: '0', // 0 = unlimited
      });

      const response = await axios.post(
        `${this.apiUrl}/CMD_API_POP`,
        params.toString(),
        {
          auth: {
            username: this.username,
            password: this.password,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      // DirectAdmin API returns text response
      const responseText = response.data.toString();
      
      // Check for error in response
      if (responseText.includes('error=1') || responseText.includes('Error')) {
        const errorMatch = responseText.match(/text=([^&]+)/);
        const errorMessage = errorMatch ? decodeURIComponent(errorMatch[1]) : 'Unknown DirectAdmin error';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('DirectAdmin API error:', error.message);
      
      // Handle specific errors
      if (error.response?.status === 401) {
        throw new Error('DirectAdmin authentication failed');
      }
      
      if (error.message.includes('already exists')) {
        throw new Error('Email account already exists');
      }
      
      throw new Error(`Failed to create email account: ${error.message}`);
    }
  }

  /**
   * Delete an email account in DirectAdmin
   */
  async deleteEmailAccount(email: string): Promise<void> {
    try {
      const [user, domain] = email.split('@');
      
      const params = new URLSearchParams({
        action: 'delete',
        domain: domain,
        user: user,
      });

      const response = await axios.post(
        `${this.apiUrl}/CMD_API_POP`,
        params.toString(),
        {
          auth: {
            username: this.username,
            password: this.password,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const responseText = response.data.toString();
      
      if (responseText.includes('error=1') || responseText.includes('Error')) {
        const errorMatch = responseText.match(/text=([^&]+)/);
        const errorMessage = errorMatch ? decodeURIComponent(errorMatch[1]) : 'Unknown DirectAdmin error';
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('DirectAdmin API error:', error.message);
      throw new Error(`Failed to delete email account: ${error.message}`);
    }
  }

  /**
   * Check if DirectAdmin is accessible
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/CMD_API_SHOW_USER_CONFIG`,
        {
          auth: {
            username: this.username,
            password: this.password,
          },
        }
      );
      
      return response.status === 200;
    } catch (error) {
      console.error('DirectAdmin connection test failed:', error);
      return false;
    }
  }
}