import { Table, Spinner, Text, Box, Image, Button, VStack, Input, Textarea, Dialog, Portal } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { deleteUserBook, getUserBooks, patchUserBook } from '../api/user'
import { BookFeedbackSchema, UserAndBookRow } from '../../../shared/types/types'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import default_book from '../assets/default_book.jpg'
import { z } from 'zod'

const MyBooks = ({ bookUpdateKey }: { bookUpdateKey: number }) => {

  const [userBooks, setUserBooks] = useState<UserAndBookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<{ [key: string]: Partial<UserAndBookRow> }>({});
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
  const [openedBookId, setOpenedBookId] = useState<string | null>(null);
  


   useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getUserBooks();
        setUserBooks(books);
      } catch (err) {
        console.error("Failed to fetch user books", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [bookUpdateKey]);

  const toggleEditMode = (userBookId: string) => {
    setEditingRowId((prev) => (prev === userBookId ? null : userBookId));
  };

  const trimTags = (tags?: string[] | string): string => {
    let tagArray: string[] = [];

    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          tagArray = parsed;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message || "Invalid tag format");
        } else {
          setError("An unknown error occurred");
        }
      }
    } else if (Array.isArray(tags)) {
      tagArray = tags;
    } else {
      return '🤷‍♀️ No tags';
    }

    const filtered = [...new Set (tagArray.filter(tag => tag && tag !== 'Unknown'))];
    return filtered.length > 0 ? filtered.join(', ') : '🤷‍♀️ No tags';
  };

  const convertRating = (rating: number) => {
    if (!rating || rating == 0) {
      return '❓';
    }
    else {
      return '⭐'.repeat(rating);
    }
  }

  const deleteBook = async (id: string) => {
    try {
      console.log("Deleting book with ID:", id); 
      await deleteUserBook(id)
      setUserBooks(prevBooks => prevBooks.filter(book => book.user_book_id !== id));
      setOpenedBookId(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to delete a book");
      } else {
        setError("An unknown error occurred");
      }
    }
  }



  const handleEditChange = (id: string, field: string, value: any) => {
    setEditingValues(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleKeyPress = async (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      const data = editingValues[id];

      try {
        BookFeedbackSchema.parse(data);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessages = error.issues.map((issue) => issue.message).join("\n");
          alert("Validation failed:\n" + errorMessages);
          return;
        }
      }
        try {
          console.log('Patching book:', data);
          await patchUserBook(id, data);
          setEditingValues(prev => ({ ...prev, [id]: {} }));
          setUserBooks(prev =>
            prev.map(book =>
              book.user_book_id === id
                ? { ...book, ...data }
                : book
            )
          );
          setEditingRowId(null);
        console.log('Update successful');
        } catch (err) {
          console.error('Failed to patch:', err);
        }

    }
  };

  const rows = userBooks.length > 0 ? userBooks.map((item, index) => {

    return (
    <Table.Row key={index} >
      <Table.Cell width="1px"
        whiteSpace="normal" maxWidth="100px">
        <VStack gap={10} pr={4}>
        <Box boxSize="4">
          <Button variant="outline" size="sm" onClick={() => toggleEditMode(item.user_book_id)}>
            <PencilIcon />
          </Button>
          </Box>
          <Box boxSize="4">
          <Dialog.Root open={openedBookId === item.user_book_id}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpenedBookId(item.user_book_id)}>
        <TrashIcon />
        </Button>
      </Dialog.Trigger>
      {/* {opened &&  */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Are you sure that you want to delete this book?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
              This action cannot be undone. The book and all related data will be permanently deleted.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={() => setOpenedBookId(null)}>Cancel</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button onClick={() => deleteBook(item.user_book_id)}>Delete</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
      {/* } */}
    </Dialog.Root>
          </Box>
        </VStack>
    </Table.Cell>
      <Table.Cell width="1px"
        whiteSpace="normal"
        maxWidth="300px">
        <Image src={!item.image_url ||item.image_url === "default" ? default_book : item.image_url} h="200px"
          maxW={150}
          fit="contain"/>
      </Table.Cell>
      <Table.Cell width="1px"
        whiteSpace="normal"
        maxWidth="300px">{item.isbn}</Table.Cell>
      <Table.Cell width="100px"
        whiteSpace="normal"
        maxWidth="500px"
        >{item.title}</Table.Cell>
      <Table.Cell width="100px"
        whiteSpace="normal"
        maxWidth="400px">{item.author}</Table.Cell>
      <Table.Cell width="1px"
        whiteSpace="normal"
        maxWidth="300px">{item.year}</Table.Cell>
      <Table.Cell width="1px"
        whiteSpace="normal"
        maxWidth="300px">{item.language}</Table.Cell>
      <Table.Cell  width="1px"
        whiteSpace="normal"
        maxWidth="300px">{item.genre}</Table.Cell>
      <Table.Cell width="160px"
        whiteSpace="normal"
        maxWidth="300px">
        {trimTags(item.tags)}
      </Table.Cell>
      <Table.Cell width="1px"
        whiteSpace="normal"
        maxWidth="300px">{item.page_count}</Table.Cell>
      {/* <Table.Cell w={150} textAlign="center">{item.rating ? convertRating(item.rating) : convertRating(0)}</Table.Cell> */}
      <Table.Cell w={150} textAlign="center">
      {editingRowId === item.user_book_id ? (
            <Input
              size="sm"
              maxW={12}
              placeholder="1–5"
              value={editingValues[item.user_book_id]?.rating ?? item.rating ?? 0}
              onChange={(e) => handleEditChange(item.user_book_id, 'rating', Number(e.target.value))}
              onKeyDown={(e) => handleKeyPress(e, item.user_book_id)}
              onFocus={() => setFocusedRowId(item.user_book_id)}
              onBlur={() => setFocusedRowId(null)}
              style={{
                border: focusedRowId === item.user_book_id ? '2px solid #3182ce' : '1px solid #e2e8f0',
                boxShadow: focusedRowId === item.user_book_id ? '0 0 10px rgba(49, 130, 206, 0.5)' : 'none',
              }}
            />
          ) : (
            convertRating(item.rating || 0)
          )}
    </Table.Cell>
      {/* <Table.Cell w={4}>{item.month_of_reading}</Table.Cell> */}
      <Table.Cell width="150px"
        whiteSpace="normal"
        maxWidth="300px">
  {editingRowId === item.user_book_id ? (
     <Input
     size="lg"
     placeholder="Choose month"
     value={editingValues[item.user_book_id]?.month_of_reading ?? item.month_of_reading ?? ""}
     onChange={(e) => handleEditChange(item.user_book_id, 'month_of_reading', (String(e.target.value).charAt(0).toUpperCase() + String(e.target.value).slice(1).trim())
     )}
     onKeyDown={(e) => handleKeyPress(e, item.user_book_id)}
     onFocus={() => setFocusedRowId(item.user_book_id)}
     onBlur={() => setFocusedRowId(null)}
     style={{
       border: focusedRowId === item.user_book_id ? '2px solid #3182ce' : '1px solid #e2e8f0',
       boxShadow: focusedRowId === item.user_book_id ? '0 0 10px rgba(49, 130, 206, 0.5)' : 'none',
     }}
   />) : (
      item.month_of_reading
    )}
  </Table.Cell>

      {/* <Table.Cell  w={4}>{item.year_of_reading}</Table.Cell> */}
      <Table.Cell w={4}>
      {editingRowId === item.user_book_id ? (
            <Input
            size="sm"
            maxW={20}
            placeholder="Year"
            value={editingValues[item.user_book_id]?.year_of_reading ?? item.year_of_reading ?? ''}
            onChange={(e) => handleEditChange(item.user_book_id, 'year_of_reading', Number(e.target.value))}
            onKeyDown={(e) => handleKeyPress(e, item.user_book_id)}
            onFocus={() => setFocusedRowId(item.user_book_id)}
            onBlur={() => setFocusedRowId(null)}
            style={{
              border: focusedRowId === item.user_book_id ? '2px solid #3182ce' : '1px solid #e2e8f0',
              boxShadow: focusedRowId === item.user_book_id ? '0 0 10px rgba(49, 130, 206, 0.5)' : 'none',
            }}
          />
          ) : (
            item.year_of_reading
          )}
    </Table.Cell>
      {/* <Table.Cell>{item.comment}</Table.Cell> */}
      <Table.Cell maxWidth="100px">
      {editingRowId === item.user_book_id ? (
         <Box position="relative">
        <Textarea placeholder="Comment can be max 1000 characters long."
        size="md"
        h={100}
        value={editingValues[item.user_book_id]?.comment ?? item.comment ?? ''}
        onChange={(e) => handleEditChange(item.user_book_id, 'comment', String(e.target.value))}
            onKeyDown={(e) => handleKeyPress(e, item.user_book_id)}
            onFocus={() => setFocusedRowId(item.user_book_id)}
            onBlur={() => setFocusedRowId(null)}
            style={{
              border: focusedRowId === item.user_book_id ? '2px solid #3182ce' : '1px solid #e2e8f0',
              boxShadow: focusedRowId === item.user_book_id ? '0 0 10px rgba(49, 130, 206, 0.5)' : 'none',
            }}/>
            <Text
            fontSize="xs"
            color="gray.500"
            position="absolute"
            bottom="4px"
            right="8px"
          >
            {(editingValues[item.user_book_id]?.comment?.length ?? item.comment?.length ?? 0)} / 1000
          </Text>
      </Box>
          ) : (
        <Text textAlign="center">{item.comment}</Text>
      )}
    </Table.Cell>
    </Table.Row>);
}) : (
    <Table.Row>
      <Table.Cell colSpan={15}>
        <Text textAlign="center" color="gray.500">
          Nothing here yet :()
        </Text>
      </Table.Cell>
    </Table.Row>
  );


  return (
    <>
    {loading ? <Spinner
    color="red.500"
    css={{ "--spinner-track-color": "colors.gray.200" }}
  /> :
    (
    <>
    <Table.Root mt={8}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader></Table.ColumnHeader>
          <Table.ColumnHeader>Image</Table.ColumnHeader>
          <Table.ColumnHeader>ISBN</Table.ColumnHeader>
          <Table.ColumnHeader>Title</Table.ColumnHeader>
          <Table.ColumnHeader>Author</Table.ColumnHeader>
          <Table.ColumnHeader>Year</Table.ColumnHeader>
          <Table.ColumnHeader>Language</Table.ColumnHeader>
          <Table.ColumnHeader>Genre</Table.ColumnHeader>
          <Table.ColumnHeader>Tags</Table.ColumnHeader>
          <Table.ColumnHeader>Pages</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center">Rating</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center">Month Of Reading</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center">Year Of Reading</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="center">Comment</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>{rows}</Table.Body>
    </Table.Root>
  </>)}
  </>
  )
}

export default MyBooks