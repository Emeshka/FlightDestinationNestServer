import { Controller, Post, Get, UseInterceptors, UploadedFile, Body, Param, Req, Request, Headers as HeadersNest } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileBlob } from '@prisma/client';
import { Express } from 'express';

@Controller('file')
export class FileController {
    constructor(
        private fileService: FileService
    ) {}

    @Get(":id")
    async getFileById(
        @Param("id") id: string
    ): Promise<any> {
        const file: FileBlob = await this.fileService.getById(id);
        const response: any = {
            name: file.name,
            id: file.id,
            type: file.type,
            destination_id: file.destination_id,
            size: file.data.byteLength,
            data: file.data.toString('base64')
        }
        return response
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() queryBody: any,
        @Req() req: Request
    ): Promise<string> {
        const headers: any = req.headers
        const fileBlobId: string = await this.fileService.createFile(file, queryBody.name, Number(queryBody.destination_id));
        const fileURL: string = headers.host + '/' + req.url + '/' + fileBlobId
        return fileURL
    }
}
