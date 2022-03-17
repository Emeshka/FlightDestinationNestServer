import { Controller, Put, Post, Body, Param, Res, HttpStatus, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Express } from 'express';
import { DestinationService } from './destination.service';
import { FileService } from '../file/file.service';
import { Article } from '@prisma/client';

@Controller('destination')
export class DestinationController {
    constructor(
        private destinationService: DestinationService,
        private fileService: FileService
    ) {}

    @Put("/article/:lang/:destination_id")
    async addArticle(
        @Param("lang") lang: string,
        @Param("destination_id") destinationId: string,
        @Body() queryBody: any,
        @Res() response: Response
    ): Promise<Response> {
        const message = await this.destinationService.addArticle(
            Number(destinationId), 
            lang,
            queryBody.title, 
            queryBody.text
        )
        return response
            .status(message == 'OK' ? HttpStatus.OK : HttpStatus.CONFLICT)
            .send(message)
    }

    @Post("/file/:destination_id")
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Param("destination_id") destinationId: string,
        @Body() queryBody: any
    ): Promise<string> {
        const fileBlobId: string = await this.fileService.createFile(file, queryBody.name, Number(destinationId))
        return fileBlobId
    }
}
