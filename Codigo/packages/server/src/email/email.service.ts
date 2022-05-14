import { Administrator } from '@Models/Administrator.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async newPasswordToAdministrator(
    administrator: Administrator,
    password: string,
  ) {
    await this.mailerService.sendMail({
      to: administrator.email,
      subject: 'Credenciais de acesso',
      template: 'administrators.NewPassword.hbs',
      context: {
        name: administrator.name,
        email: administrator.email,
        password: password,
        publicUrl: process.env.PUBLIC_URL,
      },
      // attachments: [{
      //   filename: 'logo.png',
      //   path: join(resolve(), 'public/assets/img/logo.png'),
      //   cid: 'logo',
      // }]
    });
  }

  async indicateExplorer({ email }: { email: string }): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Indicação ao SEC',
        template: 'explorer.IndicateExplorer.hbs',
        context: {
          url: process.env.ORIGIN_URL,
        },
      });

      return true;
    } catch (error) {
      console.dir(error);
      return false;
    }
  }
}
