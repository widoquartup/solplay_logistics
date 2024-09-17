import type { AccessHeadersType } from './AccessHeadersType';
// Redefinimos RequestRefreshType para que herede de AccessHeadersType
export interface RequestRefreshType extends AccessHeadersType {
    refreshtoken: string;
}

// Ahora RequestRefreshType tiene todas las propiedades de AccessHeadersType más refreshtoken
