<template>
  <div class="pattern-container">
    <div class="pattern-header">
      <h2>🛡️ Proxy Pattern (구조 패턴)</h2>
      <p class="description">다른 객체에 대한 접근을 제어하는 대리자 (캐싱 & 접근 제어)</p>
    </div>

    <div class="content-grid">
      <!-- 데이터 요청 -->
      <div class="request-section">
        <h3>데이터 요청</h3>
        <div class="form-group">
          <label>데이터 ID</label>
          <input 
            v-model="dataId" 
            type="text" 
            placeholder="예: user-001" 
            @keyup.enter="fetchData"
          />
        </div>
        <button @click="fetchData" :disabled="loading" class="fetch-btn">
          {{ loading ? '⏳ 로딩 중...' : '📥 데이터 가져오기' }}
        </button>
      </div>

      <!-- 결과 표시 -->
      <div class="result-section" v-if="lastResult">
        <h3>📊 결과</h3>
        <div class="result-box" :class="{ cached: lastResult.includes('[캐시됨]') }">
          <p>{{ lastResult }}</p>
          <span class="timestamp">{{ lastFetchTime }}</span>
        </div>
      </div>

      <!-- 에러 표시 -->
      <div class="error-section" v-if="error">
        <h3>⚠️ 오류</h3>
        <p class="error-message">{{ error }}</p>
      </div>

      <!-- 캐시 정보 -->
      <div class="cache-section">
        <div class="cache-header">
          <h3>💾 캐시 정보</h3>
          <button @click="clearCache" class="clear-btn">🗑️ 캐시 지우기</button>
        </div>
        <div class="cache-info">
          <p><strong>캐시 항목 수:</strong> {{ cacheInfo.size }}</p>
          <div v-if="cacheInfo.entries.length > 0" class="cache-entries">
            <div v-for="entry in cacheInfo.entries" :key="entry.id" class="cache-entry">
              <span class="cache-id">{{ entry.id }}</span>
              <span class="cache-age">{{ entry.age }}</span>
            </div>
          </div>
          <p v-else class="empty-cache">캐시가 비어있습니다</p>
        </div>
      </div>

      <!-- 접근 로그 -->
      <div class="log-section">
        <h3>📝 접근 로그 (최근 10개)</h3>
        <div class="log-list">
          <div 
            v-for="(log, index) in recentLogs" 
            :key="index" 
            class="log-item"
            :class="{ cached: log.cached }"
          >
            <span class="log-icon">{{ log.cached ? '💾' : '🌐' }}</span>
            <span class="log-id">{{ log.id }}</span>
            <span class="log-time">{{ formatTime(log.timestamp) }}</span>
            <span class="log-badge">{{ log.cached ? '캐시' : '실제 요청' }}</span>
          </div>
          <p v-if="recentLogs.length === 0" class="empty-log">아직 로그가 없습니다</p>
        </div>
      </div>

      <!-- 설명 -->
      <div class="info-section">
        <h3>ℹ️ Proxy 패턴 특징</h3>
        <ul>
          <li>✅ <strong>캐싱:</strong> 5초 이내 동일한 데이터 요청 시 캐시된 데이터 반환</li>
          <li>✅ <strong>접근 제어:</strong> 10초 내 10회 이상 요청 시 차단</li>
          <li>✅ <strong>로깅:</strong> 모든 접근 기록 추적</li>
          <li>✅ <strong>지연 로딩:</strong> 실제 필요할 때만 데이터 가져오기</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { DataService, DataServiceProxy } from '@/assignments/proxy';

const proxy = new DataServiceProxy(new DataService());

const dataId = ref('');
const lastResult = ref('');
const lastFetchTime = ref('');
const error = ref('');
const loading = ref(false);
const cacheInfo = ref({ size: 0, entries: [] as Array<{ id: string; age: string }> });
const accessLog = ref<Array<{ id: string; timestamp: Date; cached: boolean }>>([]);

const recentLogs = computed(() => {
  return accessLog.value.slice(-10).reverse();
});

const fetchData = async () => {
  if (!dataId.value.trim()) {
    error.value = '데이터 ID를 입력해주세요.';
    return;
  }

  error.value = '';
  loading.value = true;

  try {
    const result = await proxy.fetchData(dataId.value);
    lastResult.value = result;
    lastFetchTime.value = new Date().toLocaleTimeString('ko-KR');
    
    // 로그 및 캐시 정보 업데이트
    accessLog.value = proxy.getAccessLog();
    cacheInfo.value = proxy.getCacheInfo();
  } catch (e) {
    error.value = (e as Error).message;
    lastResult.value = '';
  } finally {
    loading.value = false;
  }
};

const clearCache = () => {
  proxy.clearCache();
  cacheInfo.value = proxy.getCacheInfo();
  lastResult.value = '';
  error.value = '';
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ko-KR');
};
</script>

<style scoped>
.pattern-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pattern-header {
  text-align: center;
  margin-bottom: 2rem;
}

.pattern-header h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.description {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.content-grid {
  display: grid;
  gap: 2rem;
}

.request-section, .result-section, .error-section, .cache-section, .log-section, .info-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #34495e;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

.fetch-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.fetch-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.fetch-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result-box {
  padding: 1rem;
  background: #e8f5e9;
  border-left: 4px solid #4caf50;
  border-radius: 6px;
}

.result-box.cached {
  background: #fff3e0;
  border-left-color: #ff9800;
}

.result-box p {
  margin: 0 0 0.5rem 0;
  color: #212529;
}

.timestamp {
  font-size: 0.9rem;
  color: #6c757d;
}

.error-message {
  color: #e74c3c;
  font-weight: 500;
  margin: 0;
}

.cache-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cache-header h3 {
  margin: 0;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: #c0392b;
}

.cache-info {
  color: #495057;
}

.cache-entries {
  margin-top: 1rem;
}

.cache-entry {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.cache-id {
  font-weight: 600;
}

.cache-age {
  color: #6c757d;
  font-size: 0.9rem;
}

.empty-cache, .empty-log {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  margin: 1rem 0;
}

.log-list {
  max-height: 400px;
  overflow-y: auto;
}

.log-item {
  display: grid;
  grid-template-columns: 40px 1fr auto auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.log-item.cached {
  background: #fff3e0;
}

.log-icon {
  font-size: 1.2rem;
}

.log-id {
  font-weight: 500;
  color: #212529;
}

.log-time {
  color: #6c757d;
  font-size: 0.9rem;
}

.log-badge {
  padding: 0.25rem 0.75rem;
  background: #3498db;
  color: white;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.log-item.cached .log-badge {
  background: #ff9800;
}

.info-section ul {
  list-style: none;
  padding: 0;
}

.info-section li {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}
</style>