import type { TokenType } from "./TokenType";
export interface DecodedTokenType {
    // eslint-disable-next-line
    data: TokenType;
    expiresIn: Date;
}