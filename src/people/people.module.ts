import { Logger, Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { Person, PersonSchema } from './schemas/person.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ MongooseModule.forFeature([ { name: Person.name, schema: PersonSchema } ]) ],
  controllers: [ PeopleController ],
  providers: [ PeopleService, Logger ],
})
export class PeopleModule {
}
