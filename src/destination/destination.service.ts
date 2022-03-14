import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { transliterate as tr, slugify } from 'transliteration';

@Injectable()
export class DestinationService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getById(id: number) {
        return this.prisma.destination.findUnique({
            where: {
                id: id
            }
        })
    }

    getManyCommonQueryConfiguration(language: string) {
        return {
            include: {
                articles: {
                    where: {
                        language: language
                    }
                },
                files: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        }
    }

    getDestinationCreationConfiguration(nameOriginal: string) {
        const nameTransliterated = slugify(nameOriginal)
        return {
            create: {
                name_transliterated: nameTransliterated
            }
        }
    }
}
