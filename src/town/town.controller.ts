import { Body, Controller, Post, Get, Param, Put, Res, HttpStatus } from '@nestjs/common';
import { TownService } from './town.service';
import { Town } from '@prisma/client';
import { Response } from 'express';

@Controller('town')
export class TownController {
    constructor(
        private townService: TownService
    ) {}
    
    @Get(":lang")
    async getTowns(
        @Param("lang") lang: string
    ): Promise<any> {
        return await this.townService.getTowns(lang)
    }

    @Post()
    async createTown(
        @Body() queryBody: any
    ): Promise<Town> {
        return await this.townService.createTown(queryBody.name_original)
    }

    @Put("/set-country")
    async setCountry (
        @Body() body: any,
        @Res() response: Response
    ): Promise<Response> {
        const message = await this.townService.setCountry(
            Number(body.town_id),
            Number(body.country_id)
        )
        return response
            .status(message == 'OK' ? HttpStatus.OK : HttpStatus.CONFLICT)
            .send(message)
    }
}
