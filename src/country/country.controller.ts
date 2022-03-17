import { Body, Controller, Post, Get, Param, Put, UseInterceptors, UploadedFile, HttpStatus, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CountryService } from './country.service';
import { Country } from '@prisma/client';
import { FileService } from '../file/file.service';
import { Response } from 'express';

@Controller('country')
export class CountryController {
    constructor(
        private countryService: CountryService,
        private fileService: FileService
    ) {}
    
    @Get(":lang")
    async getCountries(
        @Param("lang") lang: string
    ): Promise<any> {
        return await this.countryService.getCountries(lang)
    }

    @Post()
    async createCountry(
        @Body() queryBody: any
    ): Promise<Country> {
        return await this.countryService.createCountry(queryBody.name_original)
    }

    @Put("/flag/:destination_id")
    @UseInterceptors(FileInterceptor('file'))
    async uploadFlag(
        @UploadedFile() file: Express.Multer.File,
        @Param("destination_id") destinationId: string
    ): Promise<string> {
        const fileBlobId: string = await this.fileService.createFlagFile(file, Number(destinationId));
        return fileBlobId
    }

    @Put("/set-capital")
    async setCapital (
        @Body() body: any,
        @Res() response: Response
    ): Promise<Response> {
        const message = await this.countryService.setCapital(
            Number(body.town_id),
            Number(body.country_id)
        )
        return response
            .status(message == 'OK' ? HttpStatus.OK : HttpStatus.CONFLICT)
            .send(message)
    }

    @Put(":id/update-metadata")
    async updateMetadata (
        @Body() body: any,
        @Param("id") id: string,
        @Res() response: Response
    ): Promise<Response> {
        const message = await this.countryService.updateMetadata(
            Number(id),
            body.money
        )
        return response
            .status(message == 'OK' ? HttpStatus.OK : HttpStatus.CONFLICT)
            .send(message)
    }
}
