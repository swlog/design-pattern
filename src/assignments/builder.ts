// 1. Product (생성될 복잡한 객체)
export class Computer {
  cpu?: string;
  ram?: string;
  storage?: string;
  gpu?: string;
  powerSupply?: string;

  getSpecs(): string {
    return `
컴퓨터 사양:
- CPU: ${this.cpu || '미설정'}
- RAM: ${this.ram || '미설정'}
- 저장장치: ${this.storage || '미설정'}
- GPU: ${this.gpu || '미설정'}
- 파워: ${this.powerSupply || '미설정'}
    `.trim();
  }
}

// 2. Builder 인터페이스
export interface ComputerBuilder {
  setCPU(cpu: string): this;
  setRAM(ram: string): this;
  setStorage(storage: string): this;
  setGPU(gpu: string): this;
  setPowerSupply(power: string): this;
  build(): Computer;
}

// 3. Concrete Builder (구체적인 빌더 구현)
export class GamingComputerBuilder implements ComputerBuilder {
  private computer: Computer;

  constructor() {
    this.computer = new Computer();
  }

  setCPU(cpu: string): this {
    this.computer.cpu = cpu;
    console.log(`CPU 설정: ${cpu}`);
    return this;
  }

  setRAM(ram: string): this {
    this.computer.ram = ram;
    console.log(`RAM 설정: ${ram}`);
    return this;
  }

  setStorage(storage: string): this {
    this.computer.storage = storage;
    console.log(`저장장치 설정: ${storage}`);
    return this;
  }

  setGPU(gpu: string): this {
    this.computer.gpu = gpu;
    console.log(`GPU 설정: ${gpu}`);
    return this;
  }

  setPowerSupply(power: string): this {
    this.computer.powerSupply = power;
    console.log(`파워 설정: ${power}`);
    return this;
  }

  build(): Computer {
    console.log('컴퓨터 조립 완료!');
    return this.computer;
  }
}

// 4. Director (선택사항 - 빌더 사용을 단순화)
export class ComputerDirector {
  buildGamingPC(builder: ComputerBuilder): Computer {
    console.log('게이밍 PC 조립 시작...');
    return builder
      .setCPU('Intel i9-13900K')
      .setRAM('32GB DDR5')
      .setStorage('2TB NVMe SSD')
      .setGPU('NVIDIA RTX 4090')
      .setPowerSupply('850W 80+ Gold')
      .build();
  }

  buildOfficePC(builder: ComputerBuilder): Computer {
    console.log('사무용 PC 조립 시작...');
    return builder
      .setCPU('Intel i5-13400')
      .setRAM('16GB DDR4')
      .setStorage('512GB SSD')
      .setPowerSupply('500W 80+ Bronze')
      .build();
  }
}

// 5. 클라이언트 코드
export function buildComputer(builder: ComputerBuilder, type: 'gaming' | 'office' | 'custom'): Computer {
  const director = new ComputerDirector();
  
  switch (type) {
    case 'gaming':
      return director.buildGamingPC(builder);
    case 'office':
      return director.buildOfficePC(builder);
    case 'custom':
      // 커스텀 빌드
      return builder
        .setCPU('AMD Ryzen 7 5800X')
        .setRAM('16GB DDR4')
        .setStorage('1TB SSD')
        .setGPU('AMD RX 6700 XT')
        .setPowerSupply('650W 80+ Gold')
        .build();
    default:
      return builder.build();
  }
}