import React, { useState } from 'react'
import MyBooks from './MyBooks'
import { HStack, Button, Text, Dialog, CloseButton, Portal, Input, Box } from '@chakra-ui/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { getBooks } from '../api/books'
import { IsbnSchema } from '../../../shared/types/types'
import { useNavigate } from 'react-router-dom'

const MainPage = () => {
    const [error, setError] = useState<string | null>(null)
    const [value, setValue] = useState<string>("")
    const [bookUpdateKey, setBookUpdateKey] = useState(0);
    const [opened, setOpened] = useState<boolean>(false); 
    const [clicked, setClicked] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value.trim());
    }

    const onSave = async () => {
      const validation = IsbnSchema.safeParse(value);
      setClicked(true)
  
      if (!validation.success) {
        const firstError = validation.error.errors[0]?.message || "Fel ISBN";
        setError(firstError);
        setClicked(false)
        return;
      }
      
      try {
          await getBooks(value);
          setBookUpdateKey(prev => prev + 1); 
          setError(null);
          setOpened(false);
      } catch (err: unknown) {
          if (err instanceof Error) {
              setError(err.message ? err.message : "Kunde inte få information om boken");
            } else {
              setError("Ett okänt fel inträffade");
            }
      } finally {
        setClicked(false);
      }
    }

  return (
    <>
    <HStack>
    <Dialog.Root open={opened}>
    <Dialog.Trigger asChild>
    <Button variant="outline" size="sm" onClick={() => setOpened(true)}>
            <PlusIcon/>
        </Button>
    </Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Vänligen skriv in ISBN för boken du vill lägga till</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Input placeholder="ISBN" onChange={handleChange}/>
            {error && <Box color="red.500">{error}</Box>}
          </Dialog.Body>
          <Dialog.Footer>
              <Button variant="outline" loading={clicked} loadingText="Sparar..." onClick={onSave}>Spara</Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" onClick={() => setOpened(false)} />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root> 
        
        <Button onClick={() => navigate("/stats")}>
            <Text>Statistik</Text>
        </Button>
    </HStack>
    <MyBooks key={bookUpdateKey} bookUpdateKey={bookUpdateKey}/>
    </>
  )
}

export default MainPage