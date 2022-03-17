import { Injectable } from '@nestjs/common';
import { Article, Destination } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleService {
    constructor(private prisma: PrismaService) {}

    async getAvailableLanguagesForDestinationId(destinationId: number): Promise<string[]> {
        const articleList = await this.prisma.article.findMany({
            where: {
                destination_id: destinationId
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

    async setLanguage(articleId: number, language: string): Promise<string> {
        let message = "OK"
        try {
            const article = await this.getById(articleId)
            if (article) {
                const availableLanguages = await this.getAvailableLanguagesForDestinationId(article.destination_id)
                if (availableLanguages.includes(language)) {
                    message = "An article in the provided language already exists: article id: " + articleId + ", language: " + language
                } else {
                    await this.prisma.article.update({
                        where: {
                            id: articleId
                        },
                        data: {
                            language: language
                        }
                    })
                }
            } else {
                message = "Cannot find an article with id: " + articleId
            }
        } catch (e) {
            if (e.code = "P2025") {
                message = "Cannot find an article with id: " + articleId
            } else {
                message = "Failure"
            }
        }
        return message
    }
}
