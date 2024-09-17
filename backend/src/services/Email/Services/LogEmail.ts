
import { EmailInterface } from '../Interfaces/EmailInterface';

class LogEmail implements EmailInterface {


  constructor() {

  }

  send(message: object): void {
    console.log('log email message->', message);
  }

}
// Exporta una instancia de la clase
// export const email = new LogEmail();
// exporto la clase
export default LogEmail;
