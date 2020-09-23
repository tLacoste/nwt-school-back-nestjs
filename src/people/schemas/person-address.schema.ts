import { Prop } from '@nestjs/mongoose';

export class PersonAddress {
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
