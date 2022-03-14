import { Controller, Get, Param } from '@nestjs/common';
import { DestinationService } from 'src/destination/destination.service';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
    constructor(private articleService: ArticleService) {}

    @Get(":lang/:destination_id")
    getArticleByDestinationAndLanguage(
        @Param("lang") lang: string,
        @Param("destination_id") destinationId: string
    ) {
        return this.articleService.getByLanguageAndDestination(Number(destinationId), lang)
    }
}
