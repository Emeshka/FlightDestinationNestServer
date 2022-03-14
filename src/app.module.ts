import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { FileService } from './file/file.service';
import { CountryService } from './country/country.service';
import { TownService } from './town/town.service';
import { DestinationService } from './destination/destination.service';
import { ArticleService } from './article/article.service';
import { CountryController } from './country/country.controller';
import { TownController } from './town/town.controller';
import { ArticleController } from './article/article.controller';
import { DestinationController } from './destination/destination.controller';
import { FileController } from './file/file.controller';

@Module({
  imports: [],
  controllers: [AppController, CountryController, TownController, ArticleController, DestinationController, FileController],
  providers: [AppService, PrismaService, FileService, CountryService, TownService, DestinationService, ArticleService],
})
export class AppModule {}
