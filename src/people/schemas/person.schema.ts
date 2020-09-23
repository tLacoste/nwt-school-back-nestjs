import { Document } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ toJSON: { virtuals: true }, versionKey: false })
export class Person extends Document {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  photo: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  firstname: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  lastname: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  entity: string;

  @Prop({
    type: Date,
    required: true,
  })
  birthDate: number;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    match: /^(\+\d{11})$/,
  })
  phone: string;


}
