export interface RequestAuthType {
    email: string;
    password: string;
    ip_address: string;
    origin: string;
    agent: string;
  
}
export interface RequestAuthByApiKeyType {
    apiKey: string;
    ip_address: string;
    origin: string;
    agent: string;
}
