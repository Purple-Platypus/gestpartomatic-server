import { PickType } from '@nestjs/swagger';
import ListDto from './list.dto';

export class UpdateListDto extends PickType(ListDto, [
  'name',
  'rank',
  'progression',
] as const) {}
