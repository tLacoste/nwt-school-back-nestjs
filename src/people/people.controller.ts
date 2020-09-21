import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { Person } from './interfaces/person.interface';
import { PeopleService } from './people.service';
import { PeopleInterceptor } from './interceptors/people.interceptor';
import { Observable } from 'rxjs';

@Controller('people')
@UseInterceptors(PeopleInterceptor)
export class PeopleController {
  /**
   * Class constructor
   * @param _peopleService
   */
  constructor(private readonly _peopleService: PeopleService) {
  }

  /**
   * Handler to answer to /people route
   *
   * @returns Observable<Person[] | void>
   */
  @Get()
  findAll(): Observable<Person[] | void> {
    return this._peopleService.findAll();
  }
}
