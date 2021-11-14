import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateUserDto from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import TokenPayload from './interfaces/tokenPayload.interface';
import SendResetEmailDto from './dto/send-reset-email.dto';
import ResetPasswordDto from './dto/reset-password.dto';
import { MailService } from 'src/mails/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  // Création d'un nouvel utilisateur
  public async signin(signinData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(signinData.password, 10);
    const hashedCreatedUser = {
      ...signinData,
      password: hashedPassword,
    };

    try {
      const createdUser = await this.usersService.create(hashedCreatedUser);
      return createdUser;
    } catch (error) {
      if (error.code == 'P2002') {
        throw new HttpException(
          'duplicate key : ' + error.meta.target.join(', '),
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      throw new HttpException('Ouch !', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Récupération de l'utilisateur connecté
  public async getAuthUser(email: string, password: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(password, user.password);
      delete user.password;

      return user;
    } catch (error) {
      throw new HttpException(
        "Echec de l'authentification",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // Authentification de l'utilisateur
  private async verifyPassword(password: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException(
        "Echec de l'authentification",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // Constitution du cookie d'authentifaction
  public getCookieWithJwtToken(user: User): string {
    const secret = this.configService.get('JWT_SECRET');
    const expiresIn = this.configService.get('JWT_EXPIRATION_TIME');

    const payload: TokenPayload = {
      email: user.email,
      id: user.id,
    };

    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn: expiresIn + 's',
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }

  // Constitution du cookie de rafraichissement
  public getCookieWithJwtRefreshToken(id: string): Record<string, string> {
    const secret = this.configService.get('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRATION_TIME');
    const payload = {
      id,
    };
    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn: `${expiresIn}s`,
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;

    return {
      cookie,
      token,
    };
  }

  // Remise à blanc des cookies d'authentifaction
  public getCookieForLogOut(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  // Envoi d'un email contenant un lien de modification du mot de passe
  public async sendResetEmail(
    sendResetEmailData: SendResetEmailDto,
  ): Promise<void> {
    let user;
    try {
      user = await this.usersService.getByEmail(sendResetEmailData.email);
    } catch (error) {
      throw new HttpException(
        ` Cet utilisateur n'existe pas`,
        HttpStatus.NOT_FOUND,
      );
    }

    const userCreateDate = new Date(user.createdAt);

    const secret = user.password + userCreateDate.getTime();
    const token = this.jwtService.sign(
      { id: user.id },
      {
        secret,
        expiresIn: '3600s',
      },
    );

    await this.mailService.sendResetEmail(user, token);
  }

  // Modification du mot de passe
  public async resetPassword(resetPasswordData: ResetPasswordDto) {
    let user;
    try {
      user = await this.usersService.getById(resetPasswordData.id);
    } catch (error) {
      throw new HttpException(
        `Cet utilisateur n'existe pas`,
        HttpStatus.NOT_FOUND,
      );
    }
    const userCreateDate = new Date(user.createdAt);
    const secret = user.password + userCreateDate.getTime();

    try {
      const payload = await this.jwtService.verifyAsync(
        resetPasswordData.token,
        { secret },
      );

      if (payload.id === user.id) {
        const updatedUser = this.updatePassword(
          resetPasswordData.password,
          user.id,
        );
        return updatedUser;
      } else {
        throw new HttpException('Mise à jour refusée', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new HttpException('Mise à jour refusée', HttpStatus.UNAUTHORIZED);
    }
  }

  // Mise à jour du mot de passe en base
  public async updatePassword(password, userId) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await this.usersService.update(userId, {
        password: hashedPassword,
      });
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        'Echec de la mise à jour du mot de passe',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getUserFromAuthToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
    if (payload.id) {
      return this.usersService.getById(payload.id);
    }
  }
}
