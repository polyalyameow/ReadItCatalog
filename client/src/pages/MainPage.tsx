import React, { useState, useRef } from 'react'
import MyBooks from './MyBooks'
import { HStack, Button, Text, Dialog, CloseButton, Portal, Input, Box } from '@chakra-ui/react'
import { BellAlertIcon, PlusIcon } from '@heroicons/react/24/outline'
import { getBooks } from '../api/books'
import { IsbnSchema, BookInfo } from '../../../shared/types/types'
import { useNavigate } from 'react-router-dom'

const MainPage = () => {
    const [error, setError] = useState<string | null>(null)
    const [value, setValue] = useState<string>("")
    const [bookUpdateKey, setBookUpdateKey] = useState(0);
    const [opened, setOpened] = useState<boolean>(false); 
    const [clicked, setClicked] = useState<boolean>(false);
    const [showInfo, setShowInfo] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);
    const [books, setBooks] = useState<BookInfo[]>([]);

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

      if (books.some(book => book.isbn === value)) {
        setError("Den här boken finns redan i din lista.");
        setClicked(false);
        return;
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const fetchedBook = await getBooks(value, controller.signal);
        if (!controller.signal.aborted) {
          setBooks(prev => [...prev, fetchedBook]);
          setBookUpdateKey(prev => prev + 1); 
          setError(null);
          setOpened(false);
        };
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Fetch aborted");
          return;
        }
        setError(err instanceof Error && err.message || "Kunde inte få information om boken");
      } finally {
        setClicked(false);
        controllerRef.current = null;
      }
    }

    const handleDialogClose = () => {
      controllerRef.current?.abort();
      controllerRef.current = null;
      setOpened(false);
    };
    
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
            <CloseButton size="sm" onClick={handleDialogClose} />
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root> 
        
        <Button variant="outline" onClick={() => navigate("/stats")}>
            <Text>Statistik</Text>
        </Button>
        <Button onClick={() => setShowInfo((prev) => !prev)} m={4} variant="outline">
          <BellAlertIcon style={{ color: showInfo ? 'black' : 'red', width: '1.5rem', height: '1.5rem' }} />
        </Button>
    </HStack>
    <MyBooks key={bookUpdateKey} bookUpdateKey={bookUpdateKey} showInfo={showInfo} setShowInfo={setShowInfo}/>
    </>
  )
}

export default MainPage