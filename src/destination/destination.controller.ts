import { Controller } from '@nestjs/common';
import { DestinationService } from './destination.service';

@Controller('destination')
export class DestinationController {
    constructor(private destinationService: DestinationService) {}
}
