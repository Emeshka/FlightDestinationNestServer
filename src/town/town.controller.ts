import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { TownService } from './town.service';
import { Town } from '@prisma/client';

@Controller('town')
export class TownController {
    constructor(private townService: TownService) {}
    
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
}
