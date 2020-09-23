import { Logger, Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { Person, PersonSchema } from './schemas/person.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PeopleDao } from './dao/people.dao';

@Module({
  imports: [ MongooseModule.forFeature([ { name: Person.name, schema: PersonSchema } ]) ],
  controllers: [ PeopleController ],
  providers: [ PeopleService, Logger, PeopleDao ],
})
export class PeopleModule {
}
