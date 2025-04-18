import { Box, Field, Input, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { UserRegistration, UserRegistrationSchema } from '../../../shared/types/types';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { ZodError } from 'zod';

const RegisterPage = () => {
    const [formData, setFormData] = useState<UserRegistration>({email: "", username: "", password: "", confirm_password: ""});
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const {register} = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };
    
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});
    
    try {
        UserRegistrationSchema.parse(formData);
    
        const response = await registerUser(formData);
        console.log("Register successful:", response);
        localStorage.setItem("token", response.token);
        register(response.token);
        navigate("/");
    } catch (err) {
        if (err instanceof ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((e) => {
            if (e.path.length > 0) {
            errors[e.path[0] as string] = e.message;
            }
        });
        setFormErrors(errors);
        } else if (err instanceof Error) {
        setError(err.message || "Register failed");
        } else {
        setError("An unknown error occurred");
        }
    }
    };
      


  return (
    <Box maxW="md" mx="auto" p={4} mt={8}>
          <form onSubmit={handleSubmit}>
            <Field.Root id="email" mb={4}>
              <Field.Label>Email</Field.Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {formErrors && <Box color="red.500">{formErrors.email}</Box>}
            </Field.Root>
            <Field.Root id="username" mb={4}>
              <Field.Label>Username</Field.Label>
              <Input
                type="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {formErrors && <Box color="red.500">{formErrors.username}</Box>}
            </Field.Root>
            <Field.Root id="password" mb={4}>
              <Field.Label>Password</Field.Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {formErrors && <Box color="red.500">{formErrors.password}</Box>}
            </Field.Root>
            <Field.Root id="confirm_password" mb={4}>
              <Field.Label>Confirm Password</Field.Label>
              <Input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
              {formErrors && <Box color="red.500">{formErrors.confirm_password}</Box>}
            </Field.Root>
            {error && <Box color="red.500">{error}</Box>}
            <Button type="submit" colorScheme="teal" width="full">
              Register
            </Button>
          </form>
        </Box>
  )
}

export default RegisterPage

