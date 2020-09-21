import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { from, Observable, of, throwError } from 'rxjs';
import { Person } from './interfaces/person.interface';
import { find, findIndex, map, mergeMap, tap } from 'rxjs/operators';
import { PEOPLE } from '../data/people';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

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
   * Check if person already exists and add it in people list
   *
   * @param person to create
   *
   * @returns {Observable<Person>}
   */
  create(person: CreatePersonDto): Observable<Person> {
    return from(this._people)
      .pipe(
        find(_ => _.lastname.toLowerCase() === person.lastname.toLowerCase() &&
          _.firstname.toLowerCase() === person.firstname.toLowerCase()),
        mergeMap(_ =>
          !!_ ?
            throwError(
              new ConflictException(`People with lastname '${person.lastname}' and firstname '${person.firstname}' already exists`),
            ) :
            this._addPerson(person),
        ),
      );
  }

  /**
   * Update a person in people list
   *
   * @param {string} id of the person to update
   * @param person data to update
   *
   * @returns {Observable<Person>}
   */
  update(id: string, person: UpdatePersonDto): Observable<Person> {
    return this._findPeopleIndexOfList(id)
      .pipe(
        tap(_ => Object.assign(this._people[ _ ], person)),
        map(_ => this._people[ _ ]),
      );
  }

  /**
   * Deletes one person in people list
   *
   * @param {string} id of the person to delete
   *
   * @returns {Observable<void>}
   */
  delete(id: string): Observable<void> {
    return this._findPeopleIndexOfList(id)
      .pipe(
        tap(_ => this._people.splice(_, 1)),
        map(() => undefined),
      );
  }

  /**
   * Finds index of array for current person
   *
   * @param {string} id of the person to find
   *
   * @returns {Observable<number>}
   *
   * @private
   */
  private _findPeopleIndexOfList(id: string): Observable<number> {
    return from(this._people)
      .pipe(
        findIndex(_ => _.id === id),
        mergeMap(_ => _ > -1 ?
          of(_) :
          throwError(new NotFoundException(`People with id '${id}' not found`)),
        ),
      );
  }

  /**
   * Add person with good data in people list
   *
   * @param person to add
   *
   * @returns {Observable<Person>}
   *
   * @private
   */
  private _addPerson(person: CreatePersonDto): Observable<Person> {
    return of(person)
      .pipe(
        map(_ =>
          Object.assign(_, {
            id: this._createId(),
            birthDate: this._parseDate('20/09/1991'),
            photo: 'https://randomuser.me/api/portraits/lego/6.jpg',
          }) as Person,
        ),
        tap(_ => this._people = this._people.concat(_)),
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

  /**
   * Creates a new id
   *
   * @returns {string}
   *
   * @private
   */
  private _createId(): string {
    return `${new Date().getTime()}`;
  }
}
