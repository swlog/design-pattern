<template>
  <div style="padding: 2rem; max-width: 900px; margin: 0 auto;">
    <h2 style="color: #2c3e50; margin-bottom: 1rem;">🏗️ Builder Pattern</h2>
    <p style="color: #7f8c8d; margin-bottom: 2rem; line-height: 1.6;">
      빌더 패턴은 복잡한 객체의 생성 과정을 단계별로 분리하여 동일한 생성 절차로 다른 표현을 만들 수 있게 해줍니다.
    </p>

    <div style="background: #f8f9fa; padding: 2rem; border-radius: 8px;">
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
        <div style="flex: 1; min-width: 200px;">
          <label
            style="font-weight: 600; color: #2c3e50; display: block; margin-bottom: 0.5rem;"
          >PC 종류:</label>
          <select
            v-model="pcType"
            style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ddd; font-size: 1rem; width: 100%;"
          >
            <option value="gaming">게이밍 PC</option>
            <option value="office">사무용 PC</option>
          </select>
        </div>
        <button
          @click="runBuilder"
          style="padding: 0.75rem 1.5rem; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; align-self: flex-end;"
        >
          buildComputer(builder, "{{ pcType }}") 실행
        </button>
      </div>

      <div v-if="logs.length > 0" style="margin-top: 2rem; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h3 style="color: #2c3e50; margin-bottom: 1rem;">📋 실행 결과:</h3>
        <div
          v-for="(log, index) in logs"
          :key="index"
          style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #3498db;"
        >
          <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #3498db;">
            <span style="font-weight: 600;">실행 #{{ index + 1 }}</span>
            <span style="padding: 0.25rem 0.75rem; background: #3498db; color: white; border-radius: 12px; font-size: 0.9rem;">
              {{ log.type === 'gaming' ? '게이밍 PC' : '사무용 PC' }}
            </span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div
              v-for="(msg, i) in log.messages"
              :key="i"
              style="padding: 0.75rem 1rem; background: white; border-radius: 4px; font-family: Consolas, Monaco, monospace; font-size: 0.95rem;"
            >
              🔧 {{ msg }}
            </div>
          </div>
          <div style="margin-top: 1rem; padding: 1rem; background: white; border-radius: 4px;">
            <pre style="margin: 0; font-family: Consolas, Monaco, monospace; font-size: 0.9rem; white-space: pre-wrap;">
{{ log.specs }}
            </pre>
          </div>
        </div>

        <div style="margin-top: 2rem; padding: 1.5rem; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #3498db;">
          <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">💡 패턴 설명</h4>
          <p style="margin: 0.5rem 0; color: #555; line-height: 1.6;">
            <strong>Builder 패턴</strong>은 복잡한 객체를 단계적으로 생성합니다.
          </p>
          <ul style="margin: 1rem 0 0 1.5rem; color: #555;">
            <li style="margin: 0.5rem 0;"><code style="background: white; padding: 0.2rem 0.5rem; border-radius: 3px; color: #3498db;">Computer</code>: 생성될 복잡한 제품 (Product)</li>
            <li style="margin: 0.5rem 0;"><code style="background: white; padding: 0.2rem 0.5rem; border-radius: 3px; color: #3498db;">GamingComputerBuilder</code>: 단계별 생성 메서드 제공 (Builder)</li>
            <li style="margin: 0.5rem 0;"><code style="background: white; padding: 0.2rem 0.5rem; border-radius: 3px; color: #3498db;">ComputerDirector</code>: 빌더를 사용하는 순서 정의 (Director)</li>
            <li style="margin: 0.5rem 0;">메서드 체이닝으로 읽기 쉬운 코드 작성!</li>
          </ul>
          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; padding: 1rem; background: white; border-radius: 8px; flex-wrap: wrap;">
            <div style="padding: 0.75rem 1.5rem; background: #3498db; color: white; border-radius: 8px; font-weight: 600;">Director</div>
            <div style="font-size: 1.5rem; color: #3498db;">→</div>
            <div style="padding: 0.75rem 1.5rem; background: #3498db; color: white; border-radius: 8px; font-weight: 600;">Builder</div>
            <div style="font-size: 1.5rem; color: #3498db;">→</div>
            <div style="padding: 0.75rem 1.5rem; background: #3498db; color: white; border-radius: 8px; font-weight: 600;">Product</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// ---------------------
// Builder Pattern Classes
// ---------------------
class Computer {
  cpu = ''
  ram = ''
  storage = ''
  gpu = ''
  powerSupply = ''

  getSpecs() {
    return `
컴퓨터 사양:
- CPU: ${this.cpu || '미설정'}
- RAM: ${this.ram || '미설정'}
- 저장장치: ${this.storage || '미설정'}
- GPU: ${this.gpu || '미설정'}
- 파워: ${this.powerSupply || '미설정'}
    `.trim()
  }
}

class GamingComputerBuilder {
  computer = new Computer()
  messages = []

  setCPU(cpu) { this.computer.cpu = cpu; this.messages.push(`CPU 설정: ${cpu}`); return this }
  setRAM(ram) { this.computer.ram = ram; this.messages.push(`RAM 설정: ${ram}`); return this }
  setStorage(storage) { this.computer.storage = storage; this.messages.push(`저장장치 설정: ${storage}`); return this }
  setGPU(gpu) { this.computer.gpu = gpu; this.messages.push(`GPU 설정: ${gpu}`); return this }
  setPowerSupply(power) { this.computer.powerSupply = power; this.messages.push(`파워 설정: ${power}`); return this }

  build() { this.messages.push('컴퓨터 조립 완료!'); return this.computer }
}

class ComputerDirector {
  buildGamingPC(builder) {
    builder.messages.push('🎮 게이밍 PC 조립 시작...')
    return builder
      .setCPU('Intel i9-13900K')
      .setRAM('32GB DDR5')
      .setStorage('2TB NVMe SSD')
      .setGPU('NVIDIA RTX 4090')
      .setPowerSupply('850W 80+ Gold')
      .build()
  }

  buildOfficePC(builder) {
    builder.messages.push('💼 사무용 PC 조립 시작...')
    return builder
      .setCPU('Intel i5-13400')
      .setRAM('16GB DDR4')
      .setStorage('512GB SSD')
      .setPowerSupply('500W 80+ Bronze')
      .build()
  }
}

// ---------------------
// Vue Composition Logic
// ---------------------
const logs = ref([])
const pcType = ref('gaming')

function runBuilder() {
  const builder = new GamingComputerBuilder()
  const director = new ComputerDirector()

  let computer
  if (pcType.value === 'gaming') {
    computer = director.buildGamingPC(builder)
  } else {
    computer = director.buildOfficePC(builder)
  }

  logs.value.push({
    type: pcType.value,
    messages: builder.messages,
    specs: computer.getSpecs()
  })
}
</script>
