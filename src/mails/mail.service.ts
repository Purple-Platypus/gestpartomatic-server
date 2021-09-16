import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendResetEmail(user: User, token: string) {
    const frontRootUrl = this.configService.get('FRONT_ROOT_URL');
    const resetLink = `${frontRootUrl}/auth/changePassword?user=${user.id}&token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>'
      subject: 'todo | Mot de passe oublié',
      template: './reset-email',
      context: {
        name: user.nickname || user.username,
        resetLink,
      },
    });
  }
}
