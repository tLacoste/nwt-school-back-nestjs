import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PersonAddress } from './person-address.schema';

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

  @Prop({ type: PersonAddress })
  address: PersonAddress;

  @Prop({
    type: Boolean,
    required: true,
  })
  isManager: boolean;

  @Prop({
    type: String,
    trim: true,
  })
  manager: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  managerId: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
