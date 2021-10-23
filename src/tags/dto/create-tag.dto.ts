import { PickType } from '@nestjs/swagger';
import { TagDto } from './tag.dto';

export class CreateTagDto extends PickType(TagDto, [
  'label',
  'color',
] as const) {}

export default CreateTagDto;
