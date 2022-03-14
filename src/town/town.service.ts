import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ArticleService } from 'src/article/article.service';
import { DestinationService } from 'src/destination/destination.service';

@Injectable()
export class TownService {
    constructor(
        private prisma: PrismaService,
        private articleService: ArticleService,
        private destinationService: DestinationService
    ) {}

    async getTowns(lang: string): Promise<any> {
        const queryResult:any = await this.prisma.town.findMany({
            include: {
                destination: this.destinationService.getManyCommonQueryConfiguration(lang),
                capitalOf: true,
                belongsToCountry: true
            }
        });
        for (const town of queryResult) {
            let dest = town.destination
            dest.languagesAvailable = await this.articleService.getAvailableLanguagesForDestination(dest)
        };
        return queryResult;
    }

    async createTown(nameOriginal: string) {
        return await this.prisma.town.create({
            data: {
                destination: this.destinationService.getDestinationCreationConfiguration(nameOriginal)
            },
            include: {
                destination: true
            }
        })
    }
}
