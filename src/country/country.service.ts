import { Injectable } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { DestinationService } from 'src/destination/destination.service';
import { PrismaService } from 'src/prisma.service';
import { Article, Destination, Country } from '@prisma/client';

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
                capital: {
                    include: {
                        destination: this.destinationService.getManyCommonQueryConfiguration(lang)
                    }
                },
                towns: {
                    include: {
                        destination: this.destinationService.getManyCommonQueryConfiguration(lang)
                    }
                }
            }
        });
        for (const country of queryResult) {
            const dest = country.destination
            await this.destinationService.setUpDestinationResponse(dest)
            for (const town of country.towns) {
                const destTown = town.destination
                await this.destinationService.setUpDestinationResponse(destTown)
            }
            const capital = country.capital
            if (capital) {
                const destCapital = capital.destination
                await this.destinationService.setUpDestinationResponse(destCapital)
            }
        };
        return queryResult;
    }

    async createCountry(nameOriginal: string): Promise<Country> {
        return await this.prisma.country.create({
            data: {
                destination: this.destinationService.getDestinationCreationConfiguration(nameOriginal)
            },
            include: {
                destination: true
            }
        })
    }

    async setCapital(townId: number, countryId: number): Promise<string> {
        let message = "OK"
        try {
            await this.prisma.country.update({
                where: {
                    id: countryId
                },
                data: {
                    capital: {
                        connect: {
                            id: townId
                        }
                    }
                }
            })
        } catch (e) {
            if (e.code = "P2025") {
                message = "Some of provided destinations don't exist: country id: " + countryId + ", town id: " + townId
            } else {
                message = "Failure"
            }
        }
        return message
    }

    async updateMetadata(countryId: number, money: string): Promise<string> {
        let message = "OK"
        try {
            await this.prisma.country.update({
                where: {
                    id: countryId
                },
                data: {
                    money: money
                }
            })
        } catch (e) {
            if (e.code = "P2025") {
                message = "Country doesn't exist: country id: " + countryId
            } else {
                message = "Failure"
            }
        }
        return message
    }
}
