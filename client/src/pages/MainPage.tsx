import React, { useState } from 'react'
import MyBooks from './MyBooks'
import { HStack, Button, Text, Dialog, CloseButton, Portal, Input, Box } from '@chakra-ui/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { getBooks } from '../api/books'
import { IsbnSchema } from '../../../shared/types/types'

const MainPage = () => {
    const [error, setError] = useState<string | null>(null)
    const [value, setValue] = useState<string>("")
    const [bookUpdateKey, setBookUpdateKey] = useState(0);
    const [opened, setOpened] = useState<boolean>(false); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value.trim());
    }

    const onSave = async () => {
      const validation = IsbnSchema.safeParse(value);
  
      if (!validation.success) {
        const firstError = validation.error.errors[0]?.message || "Invalid ISBN";
        setError(firstError);
        return;
      }
      
      try {
          await getBooks(value);
          //await new Promise(res => setTimeout(res, 500));
          setBookUpdateKey(prev => prev + 1); 
          setError(null);
          setOpened(false);
      } catch (err: unknown) {
          if (err instanceof Error) {
              setError(err.message ? err.message : "Failed to load the book");
            } else {
              setError("An unknown error occurred");
            }
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
            <Dialog.Title>Please type in ISBN of the book you want to add</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Input placeholder="ISBN" onChange={handleChange}/>
            {error && <Box color="red.500">{error}</Box>}
          </Dialog.Body>
          <Dialog.Footer>
              <Button variant="outline" onClick={onSave}>Save</Button>
          </Dialog.Footer>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" onClick={() => setOpened(false)} />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root> 
        
        <Button>
            <Text>Statistics</Text>
        </Button>
    </HStack>
    <MyBooks key={bookUpdateKey} bookUpdateKey={bookUpdateKey}/>
    </>
  )
}

export default MainPage