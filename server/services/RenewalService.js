/**
 * 自动续期服务
 * 用于自动续期翼龙面板等服务器托管商的服务器
 */

export class RenewalService {
  constructor(configManager, broadcast) {
    this.configManager = configManager;
    this.broadcast = broadcast;
    this.timers = new Map(); // id -> timer
    this.logs = [];
    this.maxLogs = 100;

    // 启动时加载已保存的续期配置
    this.loadSavedRenewals();
  }

  log(type, message, renewalId = null) {
    const timestamp = new Date().toLocaleTimeString('zh-CN', { hour12: false });
    const entry = {
      id: Date.now(),
      timestamp,
      type,
      message: renewalId ? `[${renewalId}] ${message}` : message,
      renewalId
    };

    console.log(`[${timestamp}] [续期] ${message}`);
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.broadcast('renewalLog', entry);
  }

  loadSavedRenewals() {
    const config = this.configManager.getFullConfig();
    const renewals = config.renewals || [];

    for (const renewal of renewals) {
      if (renewal.enabled) {
        this.startRenewal(renewal.id);
      }
    }

    if (renewals.length > 0) {
      this.log('info', `已加载 ${renewals.length} 个续期配置`);
    }
  }

  /**
   * 获取所有续期配置
   */
  getRenewals() {
    const config = this.configManager.getFullConfig();
    return config.renewals || [];
  }

  /**
   * 获取单个续期配置
   */
  getRenewal(id) {
    const renewals = this.getRenewals();
    return renewals.find(r => r.id === id);
  }

  /**
   * 添加续期配置
   */
  addRenewal(renewalConfig) {
    const config = this.configManager.getFullConfig();
    if (!config.renewals) {
      config.renewals = [];
    }

    const id = renewalConfig.id || `renewal_${Date.now()}`;
    const renewal = {
      id,
      name: renewalConfig.name || '未命名续期',
      url: renewalConfig.url || '',
      method: renewalConfig.method || 'GET',
      headers: renewalConfig.headers || {},
      body: renewalConfig.body || '',
      interval: renewalConfig.interval || 21600000, // 默认6小时
      enabled: renewalConfig.enabled !== false,
      lastRun: null,
      lastResult: null
    };

    config.renewals.push(renewal);
    this.configManager.updateConfig(config);

    this.log('info', `添加续期配置: ${renewal.name}`, id);

    if (renewal.enabled) {
      this.startRenewal(id);
    }

    return renewal;
  }

  /**
   * 更新续期配置
   */
  updateRenewal(id, updates) {
    const config = this.configManager.getFullConfig();
    const index = config.renewals?.findIndex(r => r.id === id);

    if (index === -1 || index === undefined) {
      throw new Error(`续期配置 ${id} 不存在`);
    }

    const wasEnabled = config.renewals[index].enabled;
    config.renewals[index] = {
      ...config.renewals[index],
      ...updates
    };

    this.configManager.updateConfig(config);

    // 处理启用/禁用状态变化
    if (wasEnabled && !updates.enabled) {
      this.stopRenewal(id);
    } else if (!wasEnabled && updates.enabled) {
      this.startRenewal(id);
    } else if (updates.enabled && (updates.interval || updates.url)) {
      // 配置变化，重启定时器
      this.stopRenewal(id);
      this.startRenewal(id);
    }

    return config.renewals[index];
  }

  /**
   * 删除续期配置
   */
  removeRenewal(id) {
    this.stopRenewal(id);

    const config = this.configManager.getFullConfig();
    const index = config.renewals?.findIndex(r => r.id === id);

    if (index === -1 || index === undefined) {
      return false;
    }

    config.renewals.splice(index, 1);
    this.configManager.updateConfig(config);

    this.log('info', `删除续期配置`, id);
    return true;
  }

  /**
   * 启动续期定时器
   */
  startRenewal(id) {
    const renewal = this.getRenewal(id);
    if (!renewal) {
      this.log('error', `续期配置不存在`, id);
      return false;
    }

    // 清除已有定时器
    this.stopRenewal(id);

    // 立即执行一次
    this.executeRenewal(id);

    // 设置定时器
    const timer = setInterval(() => {
      this.executeRenewal(id);
    }, renewal.interval);

    this.timers.set(id, timer);
    this.log('info', `启动续期定时器 (间隔: ${this.formatInterval(renewal.interval)})`, id);

    return true;
  }

  /**
   * 停止续期定时器
   */
  stopRenewal(id) {
    const timer = this.timers.get(id);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(id);
      this.log('info', `停止续期定时器`, id);
      return true;
    }
    return false;
  }

  /**
   * 执行续期请求
   */
  async executeRenewal(id) {
    const renewal = this.getRenewal(id);
    if (!renewal) {
      this.log('error', `续期配置不存在`, id);
      return { success: false, error: '配置不存在' };
    }

    if (!renewal.url) {
      this.log('error', `续期URL未配置`, id);
      return { success: false, error: 'URL未配置' };
    }

    this.log('info', `执行续期请求: ${renewal.method} ${renewal.url}`, id);

    try {
      const options = {
        method: renewal.method,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...renewal.headers
        }
      };

      if (renewal.method === 'POST' && renewal.body) {
        options.body = renewal.body;
        if (!options.headers['Content-Type']) {
          options.headers['Content-Type'] = 'application/json';
        }
      }

      const response = await fetch(renewal.url, options);
      const status = response.status;
      let responseText = '';

      try {
        responseText = await response.text();
        // 截断过长的响应
        if (responseText.length > 500) {
          responseText = responseText.substring(0, 500) + '...';
        }
      } catch (e) {
        responseText = '[无法读取响应]';
      }

      const result = {
        success: response.ok,
        status,
        message: response.ok ? '续期成功' : `续期失败 (${status})`,
        response: responseText,
        timestamp: new Date().toISOString()
      };

      // 更新最后执行结果
      this.updateRenewalResult(id, result);

      if (response.ok) {
        this.log('success', `续期成功 (状态码: ${status})`, id);
      } else {
        this.log('error', `续期失败 (状态码: ${status})`, id);
      }

      this.broadcast('renewalResult', { id, result });
      return result;

    } catch (error) {
      const result = {
        success: false,
        error: error.message,
        message: `请求失败: ${error.message}`,
        timestamp: new Date().toISOString()
      };

      this.updateRenewalResult(id, result);
      this.log('error', `续期请求失败: ${error.message}`, id);

      this.broadcast('renewalResult', { id, result });
      return result;
    }
  }

  /**
   * 更新续期执行结果
   */
  updateRenewalResult(id, result) {
    const config = this.configManager.getFullConfig();
    const renewal = config.renewals?.find(r => r.id === id);

    if (renewal) {
      renewal.lastRun = new Date().toISOString();
      renewal.lastResult = result;
      this.configManager.updateConfig(config);
    }
  }

  /**
   * 手动测试续期
   */
  async testRenewal(id) {
    return this.executeRenewal(id);
  }

  /**
   * 获取续期状态
   */
  getStatus() {
    const renewals = this.getRenewals();
    return renewals.map(r => ({
      ...r,
      running: this.timers.has(r.id)
    }));
  }

  /**
   * 获取续期日志
   */
  getLogs() {
    return this.logs.slice(-50);
  }

  /**
   * 格式化时间间隔
   */
  formatInterval(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);

    if (hours > 0 && minutes > 0) {
      return `${hours}小时${minutes}分钟`;
    } else if (hours > 0) {
      return `${hours}小时`;
    } else {
      return `${minutes}分钟`;
    }
  }

  /**
   * 停止所有续期
   */
  stopAll() {
    for (const [id] of this.timers) {
      this.stopRenewal(id);
    }
  }
}
