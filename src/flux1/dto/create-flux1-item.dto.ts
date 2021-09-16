import { OmitType } from '@nestjs/swagger';
import Flux1Dto from './flux1.dto';

export class CreateFlux1IemDto extends OmitType(Flux1Dto, ['id'] as const) {}
