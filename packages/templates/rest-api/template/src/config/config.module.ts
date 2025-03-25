import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import productionConfig from './environment/prod.env';
import developmentConfig from './environment/dev.env';
import testConfig from './environment/test.env';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [
                process.env.NODE_ENV === 'production'
                    ? productionConfig
                    : process.env.NODE_ENV === 'test'
                        ? testConfig
                        : developmentConfig,
            ]
        })
    ],
})
export class ConfigModule {}
