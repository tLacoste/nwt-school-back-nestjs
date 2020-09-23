import { Document } from "mongoose";
import { Prop } from '@nestjs/mongoose';

export class PersonAddress extends Document {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  street: string;

  @Prop({
    type: Number,
    required: true,
  })
  postalCode: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  city: string;
}
