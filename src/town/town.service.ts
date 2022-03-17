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
            await this.destinationService.setUpDestinationResponse(dest)
            let destCountry = town.belongsToCountry.destination
            await this.destinationService.setUpDestinationResponse(destCountry)
            town.isCapital = !!town.capitalOf
            delete town.capitalOf
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

    async setCountry(townId: number, countryId: number): Promise<string> {
        let message = "OK"
        try {
            await this.prisma.town.update({
                where: {
                    id: townId
                },
                data: {
                    belongsToCountry: {
                        connect: {
                            id: countryId
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
}
