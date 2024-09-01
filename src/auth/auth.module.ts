import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { ENV_VALUE } from 'src/config/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule.register({
    secret: ENV_VALUE.JWT_SECRET,
    signOptions: {
      expiresIn: '7d'
    }
  }), UserModule],
  providers: [AuthResolver, AuthService],
  exports: [AuthService]
})
export class AuthModule { }
