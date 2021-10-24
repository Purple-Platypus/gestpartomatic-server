import { PickType } from '@nestjs/swagger';
import TaskDto from './task.dto';

export class CreateTaskDto extends PickType(TaskDto, [
  'title',
  'description',
  'rank',
  'listId',
  'tags',
  'assignees',
] as const) {}

export default CreateTaskDto;
