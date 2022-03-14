import { Injectable } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { DestinationService } from 'src/destination/destination.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CountryService {
    constructor(
        private prisma: PrismaService,
        private articleService: ArticleService,
        private destinationService: DestinationService
    ) {}
    
    async getCountries(lang: string): Promise<any> {
        const queryResult:any = await this.prisma.country.findMany({
            include: {
                destination: this.destinationService.getManyCommonQueryConfiguration(lang),
                capital: true,
                towns: true
            }
        });
        for (const country of queryResult) {
            let dest = country.destination
            dest.languagesAvailable = await this.articleService.getAvailableLanguagesForDestination(dest)
        };
        return queryResult;
    }

    async createCountry(nameOriginal: string) {
        return await this.prisma.country.create({
            data: {
                destination: this.destinationService.getDestinationCreationConfiguration(nameOriginal)
            },
            include: {
                destination: true
            }
        })
    }
}
