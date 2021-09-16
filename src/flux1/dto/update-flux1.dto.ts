import { PartialType } from '@nestjs/swagger';
import { CreateFlux1Dto } from './create-flux1.dto';

export class UpdateFlux1Dto extends PartialType(CreateFlux1Dto) {}
