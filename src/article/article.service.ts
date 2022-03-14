import { Injectable } from '@nestjs/common';
import { Article, Destination } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleService {
    constructor(private prisma: PrismaService) {}

    async getAvailableLanguagesForDestination(dest: Destination): Promise<string[]> {
        const articleList = await this.prisma.article.findMany({
            where: {
                destination_id: dest.id
            }
        })
        return articleList.map(article => article.language)
    }

    async getByLanguageAndDestination(destId: number, language: string): Promise<Article> {
        return await this.prisma.article.findFirst({
            where: {
                destination_id: destId,
                language: language
            }
        })
    }

    async getById(id): Promise<Article> {
        return await this.prisma.article.findUnique({
            where: {
                id: id
            }
        })
    }
}
