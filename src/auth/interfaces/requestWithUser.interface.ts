import { User } from '@prisma/client';
import { Request } from 'express';

// Contenu d'une requêtee en authentification d'un utilisateur
interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
