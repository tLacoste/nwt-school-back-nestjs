import { Controller, Get } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller('hello')
export class HelloController {
  /**
   * Handler to answer to /hello route
   *
   * @returns Observable<string>
   */
  @Get()
  sayHello(): Observable<string> {
    return of('world');
  }
}
