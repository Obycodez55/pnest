import { Injectable } from '@nestjs/common';
import { RandomHelper } from './common/helpers/random.helper';

@Injectable()
export class AppService {
  getHello() {
    const name = RandomHelper.getRandomFullName();
    return RandomHelper.getCustomQuoteWithName(name, "random");
  }
}
