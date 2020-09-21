import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { Person } from './interfaces/person.interface';
import { PeopleService } from './people.service';
import { PeopleInterceptor } from './interceptors/people.interceptor';
import { Observable } from 'rxjs';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

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
   * Handler to answer to GET /people route
   *
   * @returns Observable<Person[] | void>
   */
  @Get()
  findAll(): Observable<Person[] | void> {
    return this._peopleService.findAll();
  }

  /**
   * Handler to answer to GET /people/random route
   *
   * @returns Observable<Person | void>
   */
  @Get('random')
  findRandom(): Observable<Person | void> {
    return this._peopleService.findRandom();
  }

  /**
   * Handler to answer to GET /people/:id route
   *
   * @param {string} id of the person
   *
   * @returns Observable<Person>
   */
  @Get(':id')
  findOne(@Param('id') id: string): Observable<Person> {
    return this._peopleService.findOne(id);
  }

  /**
   * Handler to answer to POST /people route
   *
   * @param createPersonDto data to create
   *
   * @returns Observable<Person>
   */
  @Post()
  create(@Body() createPersonDto: CreatePersonDto): Observable<Person> {
    return this._peopleService.create(createPersonDto);
  }

  /**
   * Handler to answer to PUT /people/:id route
   *
   * @param {string} id of the person to update
   * @param updatePersonDto data to update
   *
   * @returns Observable<Person>
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto): Observable<Person> {
    return this._peopleService.update(id, updatePersonDto);
  }

  /**
   * Handler to answer to DELETE /people/:id route
   *
   * @param {string} id of the person to delete
   *
   * @returns Observable<void>
   */
  @Delete(':id')
  delete(@Param('id') id: string): Observable<void> {
    return this._peopleService.delete(id);
  }
}
