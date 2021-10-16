import { PickType, PartialType } from '@nestjs/swagger';
import TodoDto from './todo.dto';

export class UpdateTodoDto extends PartialType(
  PickType(TodoDto, [
    'rank',
    'title',
    'description',
    'deadline',
    'priority',
    'progression',
    'isArchived',
  ] as const),
) {}

export default UpdateTodoDto;
