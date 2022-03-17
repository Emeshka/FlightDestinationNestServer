import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FileService {
    constructor(
        private prisma: PrismaService
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

    async createFlagFile(file: Express.Multer.File, countryId: number): Promise<string> {
        const fileBlob = await this.prisma.fileBlob.create({
            data: {
                data: file.buffer,
                type: file.mimetype,
                name: "",
                flagOf: { connect: { id: countryId } },
                belongsTo: { connect: { id: countryId } }
            }
        })
        return fileBlob.id
    }
}
