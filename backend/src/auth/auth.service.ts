// backend/src/auth/auth.service.ts
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Verificar si el usuario ya existe
    const existingUser = await this.usersService.findOneByEmail(dto.email);
    if (existingUser) {
      throw new ForbiddenException('El correo electrónico ya está en uso');
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Guardar el nuevo usuario en la base de datos
    const user = await this.usersService.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });

    // 4. Devolver el usuario (sin la contraseña)
    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    // 1. Encontrar al usuario por su email
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Comparar contraseñas
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Si todo está bien, generar y devolver el token JWT
    return this.signToken(user.id, user.email);
  }

  // --- Helpers ---
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = process.env.JWT_SECRET;

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}

