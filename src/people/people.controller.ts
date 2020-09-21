import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { Person } from './interfaces/person.interface';
import { PeopleService } from './people.service';
import { PeopleInterceptor } from './interceptors/people.interceptor';
import { Observable } from 'rxjs';
import { CreatePersonDto } from './dto/create-person.dto';

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

  /**
   * Handler to answer to /people/random route
   *
   * @returns Observable<Person | void>
   */
  @Get('random')
  findRandom(): Observable<Person | void> {
    return this._peopleService.findRandom();
  }

  /**
   * Handler to answer to /people/:id route
   *
   * @returns Observable<Person>
   */
  @Get(':id')
  findOne(@Param('id') id: string): Observable<Person> {
    return this._peopleService.findOne(id);
  }

  /**
   * Handler to answer to /people route
   *
   * @param createPersonDto
   *
   * @returns Observable<Person>
   */
  @Post()
  create(@Body() createPersonDto: CreatePersonDto): Observable<Person> {
    return this._peopleService.create(createPersonDto);
  }
}
