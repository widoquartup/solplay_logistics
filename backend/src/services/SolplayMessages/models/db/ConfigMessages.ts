import { Schema, model, Document } from 'mongoose';

// Definición de la interfaz para el documento
interface IConfigMessages extends Document {
  name: string;
  value: any; // Puedes ajustar este tipo según el uso específico
  createdAt: Date;
  updatedAt: Date;
}

// Definición del esquema
const ConfigMessagesSchema = new Schema<IConfigMessages>({
  name: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
}, {
  timestamps: true,
});

// Creación y exportación del modelo
const ConfigMessages = model<IConfigMessages>('ConfigMessages', ConfigMessagesSchema);

export default ConfigMessages;