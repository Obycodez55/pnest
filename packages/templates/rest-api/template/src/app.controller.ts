import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from './common/dtos/reponse.dto';
import { SuccessMessages } from './common/enums/success-messages.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello() {
    const response = this.appService.getHello();
    return new ResponseDto(SuccessMessages.WELCOME, { response });
  }
}
