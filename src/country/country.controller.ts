import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';
import { Country } from '@prisma/client';

@Controller('country')
export class CountryController {
    constructor(private countryService: CountryService) {}
    
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
}
