import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Response } from 'express';
import CreateUserDto from 'src/users/dto/create-user.dto';
import UserDto from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import ResetPasswordDto from './dto/reset-password.dto';
import SendResetEmailDto from './dto/send-reset-email.dto';
import JwtAuthGuard from './guards/jwtAuth.guard';
import JwtRefreshGuard from './guards/jwtRefresh.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';
import RequestWithUser from './interfaces/requestWithUser.interface';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // Inscription
  @Post('signin')
  @ApiOperation({ summary: "Création d'un nouvel utilisateur" })
  async signin(@Body() signinData: CreateUserDto): Promise<UserDto> {
    const createdUser = await this.authService.signin(signinData);
    return createdUser;
  }

  // Connexion
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Authentification de l'utilisateur (adresse électronique + mot de passe) et récupération des JWT d'authentification et de rafraîchissement",
  })
  async login(@Req() request): Promise<User> {
    const user = request.user;

    const accessTokenCookie = this.authService.getCookieWithJwtToken(user);
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );
    await this.usersService.setCurrentRefreshToken(
      refreshTokenCookie.token,
      user.id,
    );

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);

    return user;
  }

  // Déconnexion
  @Post('logout')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Déconnexion de l'utilisateur" })
  async logOut(@Req() request, @Res() response: Response): Promise<any> {
    await this.usersService.removeRefreshToken(request.user.id);
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    response.send();
  }

  // Envoi du mail de réinitialisation du mot de passe
  @Post('send-reset-email')
  @HttpCode(204)
  @ApiOperation({
    summary: "Demande d'envoi d'un email de réinitialisation du mot de passe",
  })
  async sendEmail(
    @Body() sendResetEmailData: SendResetEmailDto,
  ): Promise<void> {
    await this.authService.sendResetEmail(sendResetEmailData).catch((err) => {
      console.log(err);

      const errorDescription =
        err.status == '404'
          ? `Adresse inconnue`
          : `L'envoi de l'email a échoué`;
      throw new HttpException(errorDescription, err.status);
    });
  }

  // Rafraichissement du token JWT
  @Get('refresh')
  @HttpCode(204)
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Remplacement du JWT d'authentification à durée de vie courte",
  })
  refresh(@Req() request: RequestWithUser, @Res() response: Response): void {
    const accessTokenCookie = this.authService.getCookieWithJwtToken(
      request.user,
    );

    response.setHeader('Set-Cookie', accessTokenCookie);
    response.send();
  }

  // Modification du mot de passe
  @Put('reset')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Réinitialisation du mot de passe',
  })
  async reset(@Body() newPasswordData: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(newPasswordData);
  }
}
