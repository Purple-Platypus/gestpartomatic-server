import { PickType } from '@nestjs/swagger';
import TodoDto from './todo.dto';

export class UpdateTodoDto extends PickType(TodoDto, [
  'id',
  'isArchived',
  'title',
  'description',
  'deadline',
] as const) {}

export default UpdateTodoDto;
