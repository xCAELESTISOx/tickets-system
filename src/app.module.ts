import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import 'reflect-metadata';

// import { DisciplinesModule } from './modules/disciplines/disciplines.module';
// import { GroupsModule } from './modules/groups/groups.module';
// import { LessonsModule } from './modules/lessons/lessons.module';
// import { SkipsModule } from './modules/skips/skips.module';
// import { AuthModule } from './modules/auth/auth.module';
import { IssuesModule } from './modules/issues/issues.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../attends-bd',
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
    // GroupsModule,
    // DisciplinesModule,
    // LessonsModule,
    // SkipsModule,
    // AuthModule,
  ],
})
export class AppModule {}
