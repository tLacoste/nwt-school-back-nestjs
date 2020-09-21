import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleInterceptor } from './interceptors/people.interceptor';
import { Observable } from 'rxjs';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { HandlerParams } from './validators/handler-params';
import { PersonEntity } from './entities/person.entity';

@Controller('people')
@UseInterceptors(ClassSerializerInterceptor)
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
   * @returns Observable<PersonEntity[] | void>
   */
  @Get()
  findAll(): Observable<PersonEntity[] | void> {
    return this._peopleService.findAll();
  }

  /**
   * Handler to answer to GET /people/random route
   *
   * @returns Observable<PersonEntity | void>
   */
  @Get('random')
  findRandom(): Observable<PersonEntity | void> {
    return this._peopleService.findRandom();
  }

  /**
   * Handler to answer to GET /people/:id route
   *
   * @param {HandlerParams} params list of route params to take person id
   *
   * @returns Observable<PersonEntity>
   */
  @Get(':id')
  findOne(@Param() params: HandlerParams): Observable<PersonEntity> {
    return this._peopleService.findOne(params.id);
  }

  /**
   * Handler to answer to POST /people route
   *
   * @param createPersonDto data to create
   *
   * @returns Observable<PersonEntity>
   */
  @Post()
  create(@Body() createPersonDto: CreatePersonDto): Observable<PersonEntity> {
    return this._peopleService.create(createPersonDto);
  }

  /**
   * Handler to answer to PUT /people/:id route
   *
   * @param {HandlerParams} params list of route params to take person id
   * @param updatePersonDto data to update
   *
   * @returns Observable<PersonEntity>
   */
  @Put(':id')
  update(@Param() params: HandlerParams, @Body() updatePersonDto: UpdatePersonDto): Observable<PersonEntity> {
    return this._peopleService.update(params.id, updatePersonDto);
  }

  /**
   * Handler to answer to DELETE /people/:id route
   *
   * @param {HandlerParams} params list of route params to take person id
   *
   * @returns Observable<void>
   */
  @Delete(':id')
  delete(@Param() params: HandlerParams): Observable<void> {
    return this._peopleService.delete(params.id);
  }
}
