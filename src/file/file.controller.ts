import { Controller, Get, Param } from '@nestjs/common';
import { FileService } from './file.service';
import { FileBlob } from '@prisma/client';

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
}