import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        // Mockeamos PrismaService
        {
          provide: PrismaService,
          useValue: {
            // Aquí puedes agregar mocks de métodos específicos si los tests lo requieren
            // Por ahora, un objeto vacío es suficiente para que el servicio se instancie
          },
        },
        // Mockeamos ConfigService (necesario para leer la API KEY)
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GEMINI_API_KEY') return 'test-api-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});