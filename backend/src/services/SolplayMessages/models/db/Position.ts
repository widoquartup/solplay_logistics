// import mongoose, { Document, Schema } from 'mongoose';

// interface IOrder {
//   number: number;
//   fecha_entrega?: Date;
//   bulto: number;
//   delivery_ready: boolean;
//   detalle?: string;
//   cantidad: number;
//   cantidad_fabricada: number;
// }


// interface IPosition extends Document {
//   station_id: number;
//   station_type: number;
//   level: number;
//   order: IOrder;
//   delivery_date?: Date;
//   product: string;
//   number?: number;
//   full: boolean;
//   working: boolean;
// }

// const positionSchema = new Schema<IPosition>({
//   station_id: { type: Number, required: true },
//   station_type: { type: Number, required: true },
//   level: { type: Number, required: true },
//   order: {
//     number: { type: Number, required: true },
//     fecha_entrega: { type: Date },
//     bulto: { type: Number, default: -1 },
//     delivery_ready: { type: Boolean, default: false },
//     detalle: { type: String }
//   },
//   delivery_date: { type: Date },
//   product: { type: String, default: '' },
//   number: { type: Number },
//   full: { type: Boolean, default: false },
//   working: { type: Boolean, default: true }
// });

// positionSchema.index({ station_id: 1, station_type: 1, level: 1 }, { unique: true });

// const Position = mongoose.model<IPosition>('Position', positionSchema, 'positions');

// export default Position;