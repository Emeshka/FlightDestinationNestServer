import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Express } from 'express';
import { DestinationService } from 'src/destination/destination.service';
import { Destination } from '@prisma/client';

@Injectable()
export class FileService {
    constructor(
        private prisma: PrismaService,
        private destinationService: DestinationService
    ) {}

    async getById(id: string) {
        return await this.prisma.fileBlob.findUnique({
            where: {
                id: id
            }
        })
    }

    async createFile(file: Express.Multer.File, name: string, destinationId: number): Promise<string> {
        const fileBlob = await this.prisma.fileBlob.create({
            data: {
                data: file.buffer,
                type: file.mimetype,
                name: name,
                belongsTo: { connect: { id: destinationId } }
            }
        })
        return fileBlob.id
    }
}
