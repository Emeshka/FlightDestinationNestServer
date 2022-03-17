import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ArticleService } from 'src/article/article.service';
import { transliterate as tr, slugify } from 'transliteration';
import { Article, Destination, Country } from '@prisma/client';

@Injectable()
export class DestinationService {
    static TEXT_SNIPPET_SIZE: number = 300;

    constructor(
        private prisma: PrismaService,
        private articleService: ArticleService
    ) {}

    async getById(id: number) {
        return this.prisma.destination.findUnique({
            where: {
                id: id
            }
        })
    }

    async addArticle(
        destinationId: number, 
        language: string, 
        title: string, 
        text: string
    ) {
        const article: Article = await this.articleService.getByLanguageAndDestination(destinationId, language)
        let message = 'OK'
        if (article) {
            this.prisma.article.updateMany({
                where: {
                    destination_id: destinationId,
                    language: language
                },
                data: {
                    title: title,
                    text: text
                }
            })
        } else {
            try {
                await this.prisma.destination.update({
                    where: {
                        id: destinationId
                    },
                    data: {
                        articles: {
                            create: [{
                                language: language,
                                title: title,
                                text: text
                            }]
                        }
                    }
                })
            } catch (e) {
                if (e.code = "P2025") {
                    message = "Destination with such id doesn't exist: " + destinationId
                } else {
                    message = "Failure"
                }
            }
        }
        return message
        /*this.prisma.destination.update({
            where: {
                id: destinationId
            },
            data: {
                articles: {
                    upsert: {
                        where:  {
                            language: language,
                            destination_id: destinationId
                        },
                        update: {
                            title: title,
                            text: text
                        },
                        create: {
                            language: language,
                            destination_id: destinationId,
                            title: title,
                            text: text
                        }
                    }
                }
            }
        })*/
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

    async setUpDestinationResponse(dest: any): Promise<void> {
        if (!dest) return
        
        const articles = dest.articles
        if (articles && articles.length == 1) {
            const article = dest.article = {...articles[0]}
            if (article.text) {
                article.text = article.text.substring(
                    0,
                    Math.min(article.text.length, DestinationService.TEXT_SNIPPET_SIZE)
                )
            }
            delete dest.articles
        }
        dest.languagesAvailable = await this.articleService.getAvailableLanguagesForDestinationId(dest.id)
    }
}
