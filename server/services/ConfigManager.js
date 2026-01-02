import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_FILE = path.join(__dirname, '../data/config.json');
const CREDENTIALS_FILE = path.join(__dirname, '../data/credentials.json');

export class ConfigManager {
  constructor() {
    this.config = this.loadConfig();
    this.credentials = this.loadCredentials();
  }

  ensureDataDir() {
    const dataDir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  loadConfig() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    return this.getDefaultConfig();
  }

  loadCredentials() {
    try {
      if (fs.existsSync(CREDENTIALS_FILE)) {
        return JSON.parse(fs.readFileSync(CREDENTIALS_FILE, 'utf-8'));
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
    return {};
  }

  getDefaultConfig() {
    return {
      server: {
        host: 'localhost',
        port: 25565,
        username: 'MinecraftBot',
        version: false
      },
      ai: {
        enabled: true,
        model: 'gpt-3.5-turbo',
        baseURL: '',
        apiKey: '',
        systemPrompt: ''
      },
      autoChat: {
        enabled: false,
        interval: 60000,
        messages: [
          '欢迎来到服务器！',
          '有问题可以问我 !ask [问题]',
          '需要帮助请输入 !help'
        ]
      },
      autoRenew: {
        enabled: false,
        url: '',
        method: 'GET',
        headers: {},
        body: '',
        interval: 300000
      },
      modes: {
        aiView: false,
        patrol: false,
        autoChat: false
      }
    };
  }

  getConfig() {
    return {
      ...this.config,
      ai: {
        ...this.config.ai,
        apiKey: this.config.ai?.apiKey ? '***' : ''
      }
    };
  }

  getFullConfig() {
    return this.config;
  }

  updateConfig(updates) {
    this.config = {
      ...this.config,
      ...updates
    };
    this.saveConfig();
    return this.config;
  }

  updateCredentials(credentials) {
    this.credentials = {
      ...this.credentials,
      ...credentials
    };

    // Also update config with panel credentials
    if (credentials.panelUrl) {
      this.config.panel = {
        ...this.config.panel,
        url: credentials.panelUrl,
        id: credentials.id,
        path: credentials.path,
        apiKey: credentials.apiKey
      };
      this.saveConfig();
    }

    this.saveCredentials();
  }

  saveConfig() {
    try {
      this.ensureDataDir();
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Error saving config:', error);
      throw error;
    }
  }

  saveCredentials() {
    try {
      this.ensureDataDir();
      fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(this.credentials, null, 2));
    } catch (error) {
      console.error('Error saving credentials:', error);
      throw error;
    }
  }

  getServerConfig() {
    return this.config.server || {};
  }

  getAIConfig() {
    return this.config.ai || {};
  }

  setServerConfig(serverConfig) {
    this.config.server = {
      ...this.config.server,
      ...serverConfig
    };
    this.saveConfig();
  }

  setAIConfig(aiConfig) {
    this.config.ai = {
      ...this.config.ai,
      ...aiConfig
    };
    this.saveConfig();
  }
}
