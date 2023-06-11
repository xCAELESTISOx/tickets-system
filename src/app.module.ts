import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import 'reflect-metadata';

import { IssuesModule } from './modules/issues/issues.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../issues-bd',
      entities: ['./modules/*/*.entity.ts'],
      autoLoadEntities: true,
      logging: true,
      synchronize: true,
      extra: {
        ssl: { rejectUnauthorized: false },
      },
    }),
    AuthModule,
    IssuesModule,
    UsersModule,
  ],
})
export class AppModule {}
