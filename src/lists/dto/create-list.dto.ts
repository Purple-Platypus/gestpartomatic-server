import { PickType } from '@nestjs/swagger';
import ListDto from './list.dto';

export class CreateListDto extends PickType(ListDto, [
  'name',
  'boardId',
] as const) {}

export default CreateListDto;
