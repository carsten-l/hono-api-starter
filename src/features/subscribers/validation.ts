import { z } from 'zod'

export const subscriberSchema = z.object({
  email: z.email( { 
    error: (iss) => iss.input === undefined ? "Email is required." : "please provide a valid email address."
  }),
});