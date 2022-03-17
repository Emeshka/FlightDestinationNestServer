import { Controller, Get, Param, Put, Body, Res, HttpStatus } from '@nestjs/common';
import { DestinationService } from 'src/destination/destination.service';
import { ArticleService } from './article.service';
import { Response } from 'express';

@Controller('article')
export class ArticleController {
    constructor(
        private articleService: ArticleService
    ) {}

    @Get(":lang/:destination_id")
    getArticleByDestinationAndLanguage(
        @Param("lang") lang: string,
        @Param("destination_id") destinationId: string
    ) {
        return this.articleService.getByLanguageAndDestination(Number(destinationId), lang)
    }

    @Put(":id/set-language")
    async setCountry (
        @Body() body: any,
        @Param("id") id: number,
        @Res() response: Response
    ): Promise<Response> {
        const message = await this.articleService.setLanguage(
            id,
            body.language
        )
        return response
            .status(message == 'OK' ? HttpStatus.OK : HttpStatus.CONFLICT)
            .send(message)
    }
}
