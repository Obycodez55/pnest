import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from './common/dtos/reponse.dto';
import { SuccessMessages } from './common/enums/success-messages.enum';
import { AppEndpoints } from './common/enums/endpoint.enum';

@Controller(AppEndpoints.INDEX)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello() {
    const response = this.appService.getHello();
    return new ResponseDto(SuccessMessages.WELCOME, { response });
  }

  @Get(AppEndpoints.HEALTH_CHECK)
  healthCheck() {
    const healthCheckResponse = this.appService.healthCheck();
    return new ResponseDto(SuccessMessages.HEALTH_CHECK_SUCCESS, healthCheckResponse );
  }
}
