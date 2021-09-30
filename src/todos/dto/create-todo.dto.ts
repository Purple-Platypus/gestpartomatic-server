import { PickType } from '@nestjs/swagger';
import TodoDto from './todo.dto';

export class CreateTodoDto extends PickType(TodoDto, [
  'title',
  'description',
  'rank',
  'deadline',
] as const) {}

export default CreateTodoDto;
