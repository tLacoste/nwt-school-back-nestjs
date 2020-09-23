import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonEntity } from './entities/person.entity';
import { PeopleDao } from './dao/people.dao';

@Injectable()
export class PeopleService {
  /**
   * Class constructor
   *
   * @param {PeopleDao} _peopleDao instance of the DAO
   */
  constructor(private readonly _peopleDao: PeopleDao) {
  }

  /**
   * Returns all existing people in the list
   *
   * @returns {Observable<PersonEntity[] | void>}
   */
  findAll(): Observable<PersonEntity[] | void> {
    return this._peopleDao.find()
      .pipe(
        map(_ => !!_ ? _.map(__ => new PersonEntity(__)) : undefined),
      );
  }

  /**
   * Returns randomly one person of the list
   *
   * @returns {Observable<PersonEntity | void>}
   */
  findRandom(): Observable<PersonEntity | void> {
    return this._peopleDao.find()
      .pipe(
        map(_ => !!_ ? _[ Math.round(Math.random() * _.length) ] : undefined),
        map(_ => !!_ ? new PersonEntity(_) : undefined),
      );
  }

  /**
   * Returns one person of the list matching id in parameter
   *
   * @param {string} id of the person
   *
   * @returns {Observable<PersonEntity>}
   */
  findOne(id: string): Observable<PersonEntity> {
    return this._peopleDao.findById(id)
      .pipe(
        catchError(e => throwError(new UnprocessableEntityException(e.message))),
        mergeMap(_ =>
          !!_ ?
            of(new PersonEntity(_)) :
            throwError(new NotFoundException(`People with id '${id}' not found`)),
        ),
      );
  }

  /**
   * Check if person already exists and add it in people list
   *
   * @param person to create
   *
   * @returns {Observable<PersonEntity>}
   */
  create(person: CreatePersonDto): Observable<PersonEntity> {
    return this._addPerson(person)
      .pipe(
        mergeMap(_ => this._peopleDao.save(_)),
        catchError(e =>
          e.code === 11000 ?
            throwError(
              new ConflictException(`People with lastname '${person.lastname}' and firstname '${person.firstname}' already exists`),
            ) :
            throwError(new UnprocessableEntityException(e.message)),
        ),
        map(_ => new PersonEntity(_)),
      );
  }

  /**
   * Update a person in people list
   *
   * @param {string} id of the person to update
   * @param person data to update
   *
   * @returns {Observable<PersonEntity>}
   */
  update(id: string, person: UpdatePersonDto): Observable<PersonEntity> {
    return this._peopleDao.findByIdAndUpdate(id, person)
      .pipe(
        catchError(e =>
          e.code === 11000 ?
            throwError(
              new ConflictException(`People with lastname '${person.lastname}' and firstname '${person.firstname}' already exists`),
            ) :
            throwError(new UnprocessableEntityException(e.message)),
        ),
        mergeMap(_ =>
          !!_ ?
            of(new PersonEntity(_)) :
            throwError(new NotFoundException(`People with id '${id}' not found`)),
        ),
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
    return this._peopleDao.findByIdAndRemove(id)
      .pipe(
        catchError(e => throwError(new NotFoundException(e.message))),
        mergeMap(_ =>
          !!_ ?
            of(undefined) :
            throwError(new NotFoundException(`Person with id '${id}' not found`)),
        ),
      );
  }

  /**
   * Add person with good data in people list
   *
   * @param person to add
   *
   * @returns {Observable<CreatePersonDto>}
   *
   * @private
   */
  private _addPerson(person: CreatePersonDto): Observable<CreatePersonDto> {
    return of(person)
      .pipe(
        map(_ =>
          Object.assign(_, {
            birthDate: this._parseDate('20/09/1991'),
            photo: 'https://randomuser.me/api/portraits/lego/6.jpg',
          }),
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
