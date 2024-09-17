// UserService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { UserRepository } from './UserRepository';
import type { UserType } from './types/UserType';
import type { VerificationCodeType } from './types/VerificationCodeType';
import type { UpdatePassType } from './types/UpdatePassType';

import { context } from '@base/context';
import BadRequestException from '@base/Exceptions/BadRequestException';
import Templetize from '@src/services/Email/Templetize';
import type { EmailContentType } from '@src/services/Email/EmailContentType';
import { generateEmailText } from '@src/services/Email/utils';
import { TFunction } from 'i18next';

type RecoverPassType = {
  app: string,
  email: string
  t: TFunction
}

export class UserService extends ServiceBase<UserType> {
  constructor(repository: UserRepository) {
    super(repository);
  }
  /**
   *
   * @param item; contiene la información de creación de un nuevo usuario
   * @returns 
   */
  async preStoreUser(item: UserType, t: TFunction): Promise<object> {
    const code = this.generateRandomCode();
    const token = await context.token.tokenize({
      user: item,
      verificationCode: code
    }, '10m');
    const subject = t('Verificar usuario');
    const data = this.prepareCodeEmail(item.email, subject, code, t);
    this.sendEmail(data);
    return { token: token };
  }
  async verifyNewUser(body: VerificationCodeType) {
    const { token, code } = body;
    const u = await context.token.detokenize(token);
    if (u.verificationCode === code) {
      return await this.repository.create(u.user);
    }
    throw new BadRequestException([
      { message: 'Código inválido', path: ['code'] }
    ]);

  }
  async recoverPass(body: RecoverPassType) {
    // const { app, email, t } = body;
    // const user = await this.repository.findOne({ app, email });
    const {  email, t } = body;
    const user = await this.repository.findOne({  email });
    if (!user) {
      throw new BadRequestException([
        { message: 'bad user', path: ['user'] }
      ]);
    }
    const code = this.generateRandomCode();
    const token = await context.token.tokenize({
      user_id: user._id.toString(),
      verificationCode: code
    }, '10m');

    const subject = t('Recuperar contraseña');
    const data = this.prepareCodeEmail(email, subject, code, t);
    this.sendEmail(data);
    return { token: token };

  }
  async verifyRecoverPass(body: VerificationCodeType) {
    const { token, code } = body;
    const u = await context.token.detokenize(token);
    if (u.verificationCode === code) {
      //eslint-disable-next-line
      const { verificationCode, ...rest } = u;
      const passToken = await context.token.tokenize(rest, '10m');
      return { token: passToken };
      // return await this.repository.create(u.user);
    }
    throw new BadRequestException([

      { message: 'Código inválido', path: ['code'] }

    ]);

  }
  async updatePass(body: UpdatePassType) {
    const { token, password, confirmPassword } = body;
    if (password !== confirmPassword) {
      throw new BadRequestException([
        { password: 'not match' }
      ]);
    }
    const u = await context.token.detokenize(token);
    if (u.user_id) {
      await this.repository.update(u.user_id, { password: password });
      return { message: 'password updated' };
    }

    throw new BadRequestException([
      { message: 'Código inválido', path: ['code'] }
    ]);

  }
  private prepareCodeEmail(to: string, subject: string, code: string, t: TFunction): EmailContentType {
    const data = {
      to: to,
      subject: subject,
      code: code,
      paragraphs_u: [
        `${t('Hola')}`,
        t('Aquí tienes el código solicitado')
      ],
      paragraphs_d: [
        t('Saludos')
      ],
      text: '',
      preheader: `${t('Aquí tienes el código solicitado')}: ${code}`
    };
    data.text = generateEmailText(data);
    return data;
  }
  private generateRandomCode(): string {
    let code = '';
    for (let i = 0; i < 6; i++) {
      const digit = Math.floor(Math.random() * 10); // Genera un dígito aleatorio entre 0 y 9
      code += digit.toString();
    }
    return code;
  }
  private sendEmail(data: EmailContentType): void {
    const templatizeInstance = new Templetize();
    const htmlOutput = templatizeInstance.run(data);
    const message = {
      from: process.env.MAILGUN_FROM,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: `${htmlOutput}`
    };
    context.email.send(message);
  }

//
getUserGroup(user: any){
  if (user.metadata && user.metadata.superadmin){
      return "super";
  }
  if (user.metadata && user.metadata.admin){
      return "adminr";
  }
  if (user.metadata && user.metadata.user){
      return "user";
  }
  return "none";
}
// devuelve los datos del usuario logado
async getUser(data: any): Promise<unknown> {
  // console.log(">>>>req", req.body);
  try {
      // user
      // const entity = await this.service.updatePass(req.body);
      const userData =  {
          name: data.user.name, 
          email: data.user.email, 
          group: this.getUserGroup(data.user)
      };
      return userData;
  } catch (error) {
      return null;
  }
}

}
