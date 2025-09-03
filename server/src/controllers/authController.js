import { createUserSchema } from '../schemas/authSchema'

export const createUser = async (req, res) => {
  try {
    const { name, lasName, email, password } = createUserSchema.parse(req.body);
    
    

  } catch {

  }


} 