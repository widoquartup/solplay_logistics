class CancelTransit {
    private lengths: { [key: string]: number };
    private type: number;
    private msg_id: number;
    private cart_id: number;

    // type puede ser '1', '2', o '3'
    constructor(type: number = 20, msg_id: number = 0, cart_id: number = 0) {
        this.lengths = {
            type: 3,
            msg_id: 5,
            cart_id: 5
        };
        this.type = type;
        this.msg_id = msg_id;
        this.cart_id = cart_id;
    }

    // Métodos get con zero padding
    getType(): number {
        return this.type;
    }

    getMsgId(): number {
        return this.msg_id;
    }

    getCartId(): number {
        return this.cart_id;
    }

    // Función para aplicar space padding
    private spacePad(value: string | number, length: number): string {
        const stringValue = String(value);
        let padding = '';
        if (stringValue.length <= length) {
            padding = ' '.repeat(length - stringValue.length);
        }
        return padding + stringValue;
    }

    // Devuelve el mensaje completo
    getData(): string {
        return this.spacePad(this.type, this.lengths.type) +
               this.spacePad(this.msg_id, this.lengths.msg_id) +
               this.spacePad(this.cart_id, this.lengths.cart_id);
    }

    // Métodos set para cada propiedad
    setType(newType: number): void {
        this.type = newType;
    }

    setMsgId(newMsgId: number): void {
        this.msg_id = newMsgId;
    }

    setCartId(newCartId: number): void {
        this.cart_id = newCartId;
    }
}

export default CancelTransit;