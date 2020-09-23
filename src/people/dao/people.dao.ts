import { Injectable } from '@nestjs/common';
import { Model, MongooseDocument } from 'mongoose';
import { Person } from '../schemas/person.schema';
import { InjectModel } from '@nestjs/mongoose';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PeopleDao {
  /**
   * Class constructor
   *
   * @param {Model<Person>} _personModel instance of the model representing a Person
   */
  constructor(@InjectModel(Person.name) private readonly _personModel: Model<Person>) {
  }

  /**
   * Call mongoose method, call toJSON on each result and returns Person[] or undefined
   *
   * @return {Observable<Person[] | void>}
   */
  find(): Observable<Person[] | void> {
    return from(this._personModel.find({}))
      .pipe(
        map((docs: MongooseDocument[]) => (!!docs && docs.length > 0) ? docs.map(_ => _.toJSON()) : undefined),
      );
  }

  /**
   * Returns one person of the list matching id in parameter
   *
   * @param {string} id of the person in the db
   *
   * @return {Observable<Person | void>}
   */
  findById(id: string): Observable<Person | void> {
    return from(this._personModel.findById(id))
      .pipe(
        map((doc: MongooseDocument) => !!doc ? doc.toJSON() : undefined),
      );
  }
}
