// backend/src/app.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

// describe() agrupa un conjunto de pruebas relacionadas. En este caso, para AppService.
describe('AppService', () => {
  let appService: AppService;
  let prismaService: PrismaService;

  // beforeEach() se ejecuta antes de cada prueba ('it' block).
  // Esto asegura que cada prueba se ejecute en un estado limpio y aislado.
  beforeEach(async () => {
    // Test.createTestingModule() crea un módulo de NestJS para el entorno de pruebas.
    // Aquí podemos simular (mock) cualquier dependencia que nuestro servicio necesite.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: PrismaService,
          // 'useValue' nos permite reemplazar la implementación real de PrismaService
          // con un objeto simulado que nosotros controlamos.
          useValue: {
            $queryRaw: jest.fn(), // jest.fn() crea una función simulada.
          },
        },
      ],
    }).compile();

    // Obtenemos las instancias del servicio a probar y sus dependencias del módulo de prueba.
    appService = module.get<AppService>(AppService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // it() define una prueba individual. La descripción debe explicar qué se espera que haga.
  it('should be defined', () => {
    // expect() es la función de aserción de Jest.
    // .toBeDefined() comprueba que la instancia del servicio se creó correctamente.
    expect(appService).toBeDefined();
  });

  // Grupo de pruebas para el método getHello()
  describe('getHello', () => {
    it('should return "¡Bienvenido a la API de CodeNotes!"', () => {
      const expectedString = '¡Bienvenido a la API de CodeNotes!';
      
      // Act: Llamamos al método que queremos probar.
      const result = appService.getHello();
      
      // Assert: Comprobamos que el resultado es el que esperábamos.
      // .toBe() compara que el valor sea exactamente el esperado.
      expect(result).toBe(expectedString);
    });
  });

  // Grupo de pruebas para el método checkDatabaseConnection()
  describe('checkDatabaseConnection', () => {
    it('should return a success status when prisma query is successful', async () => {
      // Arrange: Configuramos nuestra simulación para que la llamada a la DB sea exitosa.
      (prismaService.$queryRaw as jest.Mock).mockResolvedValue(true);

      // Act: Llamamos al método asíncrono.
      const result = await appService.checkDatabaseConnection();

      // Assert: Comprobamos que el resultado es el objeto de éxito.
      // .toEqual() se usa para comparar objetos.
      expect(result).toEqual({
        status: 'ok',
        message: 'Conexión a la base de datos exitosa',
      });
    });

    it('should return an error status when prisma query fails', async () => {
      // Arrange: Configuramos nuestra simulación para que la llamada a la DB falle.
      const dbError = new Error('Database connection failed');
      (prismaService.$queryRaw as jest.Mock).mockRejectedValue(dbError);

      // Act: Llamamos al método asíncrono.
      const result = await appService.checkDatabaseConnection();

      // Assert: Comprobamos que el resultado es el objeto de error.
      expect(result).toEqual({
        status: 'error',
        message: 'No se pudo conectar a la base de datos',
        details: dbError.message,
      });
    });
  });
});
