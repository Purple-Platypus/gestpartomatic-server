import { PickType } from '@nestjs/swagger';
import BoardDto from './board.dto';

export class CreateBoardDto extends PickType(BoardDto, [
  'name',
  'description',
] as const) {}

export default CreateBoardDto;
