// AccessService.ts
import { ServiceBase } from '@base/Bases/ServiceBase';
import { AccessRepository } from './AccessRepository';
import { AccessType } from './types/AccessType';
import { RequestAuthByApiKeyType, RequestAuthType } from './types/RequestAuthType';
import { RequestRefreshType } from './types/RequestRefreshType';
import { ResponseAuthType } from './types/ResponseAuthType';
import { RefreshTokenType } from './types/RefreshTokenType';
import { AccessHeadersType } from './types/AccessHeadersType';
import { UserRepository } from '../User/UserRepository';
import { context } from '@base/context';
import { v4 as uuidv4 } from 'uuid';
import UnauthorizedException from '@base/Exceptions/UnauthorizedException';

export class AccessService extends ServiceBase<AccessType> {
  private user: UserRepository; // Definición de la propiedad 'user'
  constructor(repository: AccessRepository, user: UserRepository) {
    super(repository);
    this.user = user;
  }
  // sleep(ms: number): Promise<void> {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

  async login(loginData: RequestAuthType): Promise<ResponseAuthType> {
    const { email, password } = loginData;
    const accessHeaders: AccessHeadersType = {
      ip_address: loginData.ip_address,
      origin: loginData.origin,
      agent: loginData.agent
    };
    // await this.sleep(3000); // Espera durante 3000 milisegundos (3 segundos)
    const user = await this.user.findByCredentials(email, password);
    // eslint-disable-next-line
    const { password: pass, __v, ...userSafe } = user;
    const expireT = process.env.AUTH_TOKEN_EXPIRES || '1m';
    const token = await context.token.tokenize(userSafe, expireT);
    const uuid = uuidv4();
    const item = this._createAccess(uuid, user._id.toString(), accessHeaders);
    const refreshTokenUUID: RefreshTokenType = { refreshtoken_id: uuid };
    const expireRT = process.env.AUTH_REFRESH_TOKEN_EXPIRES || '365d';
    const refreshToken = await context.token.tokenize(refreshTokenUUID, expireRT);
    await this.repository.create(item);
    return { token, refreshToken };
  }

  // LOGIN BY API KEY
  async loginByApiKey(loginData: RequestAuthByApiKeyType): Promise<ResponseAuthType> {
    const { apiKey } = loginData;
    const accessHeaders: AccessHeadersType = {
      ip_address: loginData.ip_address,
      origin: loginData.origin,
      agent: loginData.agent
    };
    // await this.sleep(3000); // Espera durante 3000 milisegundos (3 segundos)
    const user = await this.user.findByApiKey(apiKey);
    console.log("user", user);
    // eslint-disable-next-line
    const { password: pass, __v, ...userSafe } = user;
    const expireT = process.env.AUTH_TOKEN_EXPIRES || '1m';
    const token = await context.token.tokenize(userSafe, expireT);
    const uuid = uuidv4();
    const item = this._createAccess(uuid, user._id.toString(), accessHeaders);
    const refreshTokenUUID: RefreshTokenType = { refreshtoken_id: uuid };
    const expireRT = process.env.AUTH_REFRESH_TOKEN_EXPIRES || '365d';
    const refreshToken = await context.token.tokenize(refreshTokenUUID, expireRT);
    await this.repository.create(item);
    return { token, refreshToken };
  }

  async refresh(refreshData: RequestRefreshType): Promise<ResponseAuthType> {
    const { refreshtoken } = refreshData;
    const rt = await context.token.detokenize(refreshtoken);
    // await this.sleep(3000); // Espera durante 3000 milisegundos (3 segundos)
    const access = await this.repository.findOne({ refreshtoken_id: rt.refreshtoken_id });
    if (!access) {
      throw new UnauthorizedException();
    }
    if (access.is_revoked) {
      throw new UnauthorizedException();
    }
    const { origin, agent } = refreshData;
    if (!(origin == access.origin && agent == access.agent)) {
    // const { ip_address, origin, agent } = refreshData;
    // if (!(ip_address == access.ip_address && origin == access.origin && agent == access.agent)) {
      throw new UnauthorizedException();
    }


    const user = await this.user.findById(access.user_id);
    if (!user) {
      throw new UnauthorizedException();
    }
    // eslint-disable-next-line
    const { password: pass, __v, ...userSafe } = user;
    const expireT = process.env.AUTH_TOKEN_EXPIRES || '1m';
    const token = await context.token.tokenize(userSafe, expireT);

    const uuid = uuidv4();

    const accessHeaders: AccessHeadersType = {
      ip_address: refreshData.ip_address,
      origin: refreshData.origin,
      agent: refreshData.agent
    };
    const item = this._createAccess(uuid, user._id.toString(), accessHeaders);

    const expireRT = process.env.AUTH_REFRESH_TOKEN_EXPIRES || '365d';
    const refreshToken = await context.token.tokenize({ refreshtoken_id: uuid }, expireRT);
    await this.repository.create(item);
    return { token, refreshToken };
  }
  private _createAccess(uuid: string, user_id: string, headers: AccessHeadersType) {
    const expire = new Date();
    expire.setFullYear(expire.getFullYear() + 1);
    const item: AccessType = Object.assign({
      user_id: user_id,
      ip_address: headers.ip_address,
      origin: headers.origin,
      agent: headers.agent,
      expiresAt: expire,
      is_revoked: false,
      refreshtoken_id: uuid,
      isDeleted: false
    }, {} as AccessType);
    return item;
  }
}
