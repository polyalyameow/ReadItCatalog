import { Box, Button, Heading, VStack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

const SessionExpired = () => {
  return (
    <Box p={8} textAlign="center">
    <VStack p={6}>
      <Heading as="h1" size="xl">
        Sessionen har gått ut
      </Heading>
      <Text>
        Din session har avslutats eller så är du inte inloggad.
      </Text>
      <Link to="/login">
        <Button colorScheme="blue">Gå till inloggning</Button>
        </Link>
    </VStack>
  </Box>
  )
}

export default SessionExpired