// backend/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    // Passport se encarga de verificar la firma y la expiración del token.
    // Aquí, solo necesitamos confirmar que el usuario del token todavía existe.
    const user = await this.usersService.findOneByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('Token no válido');
    }

    // El objeto que devolvemos aquí se adjuntará al objeto `request` de Express.
    // Podremos acceder a él en nuestras rutas protegidas como `req.user`.
    const { password, ...result } = user;
    return result;
  }
}

