// Proxy Pattern (구조 패턴)
// 다른 객체에 대한 접근을 제어하는 대리자 역할

export interface IDataService {
  fetchData(id: string): Promise<string>;
}

// Real Subject
export class DataService implements IDataService {
  async fetchData(id: string): Promise<string> {
    // 실제 데이터 가져오기 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `데이터 ${id}: ${Math.random().toString(36).substring(7)}`;
  }
}

// Proxy with caching and access control
export class DataServiceProxy implements IDataService {
  private realService: DataService;
  private cache: Map<string, { data: string; timestamp: number }> = new Map();
  private accessLog: Array<{ id: string; timestamp: Date; cached: boolean }> = [];
  private readonly CACHE_DURATION = 5000; // 5초

  constructor(realService: DataService) {
    this.realService = realService;
  }

  async fetchData(id: string): Promise<string> {
    // 접근 로깅
    const logEntry = {
      id,
      timestamp: new Date(),
      cached: false
    };

    // 캐시 확인
    const cached = this.cache.get(id);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      logEntry.cached = true;
      this.accessLog.push(logEntry);
      return `[캐시됨] ${cached.data}`;
    }

    // 접근 제어 (예: 너무 많은 요청 방지)
    const recentRequests = this.accessLog.filter(
      log => Date.now() - log.timestamp.getTime() < 10000
    ).length;

    if (recentRequests > 10) {
      throw new Error('너무 많은 요청입니다. 잠시 후 다시 시도해주세요.');
    }

    // 실제 서비스 호출
    const data = await this.realService.fetchData(id);
    
    // 캐시 저장
    this.cache.set(id, { data, timestamp: Date.now() });
    this.accessLog.push(logEntry);

    return data;
  }

  getAccessLog() {
    return [...this.accessLog];
  }

  getCacheInfo() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([id, { timestamp }]) => ({
        id,
        age: Math.floor((Date.now() - timestamp) / 1000) + '초 전'
      }))
    };
  }

  clearCache() {
    this.cache.clear();
  }
}