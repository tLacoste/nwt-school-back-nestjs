import { Injectable, NotFoundException } from '@nestjs/common';
import { from, Observable, of, throwError } from 'rxjs';
import { Person } from './interfaces/person.interface';
import { find, map, mergeMap } from 'rxjs/operators';
import { PEOPLE } from '../data/people';

@Injectable()
export class PeopleService {
  // private property to store all people
  private _people: Person[];

  /**
   * Class constructor
   */
  constructor() {
    this._people = [].concat(PEOPLE).map(person => Object.assign(person, {
      birthDate: this._parseDate(person.birthDate),
    }));
  }

  /**
   * Returns all existing people in the list
   *
   * @returns {Observable<Person[] | void>}
   */
  findAll(): Observable<Person[] | void> {
    return of(this._people)
      .pipe(
        map(_ => (!!_ && !!_.length) ? _ : undefined),
      );
  }

  /**
   * Returns randomly one person of the list
   *
   * @returns {Observable<Person | void>}
   */
  findRandom(): Observable<Person | void> {
    return of(this._people[ Math.round(Math.random() * this._people.length) ])
      .pipe(
        map(_ => !!_ ? _ : undefined),
      );
  }

  /**
   * Returns one person of the list matching id in parameter
   *
   * @param {string} id of the person
   *
   * @returns {Observable<Person>}
   */
  findOne(id: string): Observable<Person> {
    return from(this._people)
      .pipe(
        find(_ => _.id === id),
        mergeMap(_ =>
          !!_ ?
            of(_) :
            throwError(new NotFoundException(`People with id '${id}' not found`)),
        ),
      );
  }

  /**
   * Function to parse date and return timestamp
   *
   * @param {string} date to parse
   *
   * @returns {number} timestamp
   *
   * @private
   */
  private _parseDate(date: string): number {
    const dates = date.split('/');
    return (new Date(dates[ 2 ] + '/' + dates[ 1 ] + '/' + dates[ 0 ]).getTime());
  }
}
