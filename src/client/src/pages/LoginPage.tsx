import React, { useState } from "react";
import { UserLogin } from "../../../types/types";
import { loginUser } from "../api/auth"; 
import { Input, Button, Box, Field } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState<UserLogin>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token);
      login(response.token);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Login failed");
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
        </Field.Root>
        {error && <Box color="red.500">{error}</Box>}
        <Button type="submit" colorScheme="teal" width="full">
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;


