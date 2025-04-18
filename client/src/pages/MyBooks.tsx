import { Table, Spinner, Text, Box, Image, Button, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { deleteUserBook, getUserBooks } from '../api/user'
import { UserAndBookRow } from '../../../shared/types/types'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import default_book from '../assets/default_book.jpg'

const MyBooks = ({ bookUpdateKey }: { bookUpdateKey: number }) => {

  const [userBooks, setUserBooks] = useState<UserAndBookRow[]>([]);
  const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    console.log('Fetching books...');
    const fetchBooks = async () => {
      try {
        const books = await getUserBooks();
        setUserBooks(books);
      } catch (err) {
        console.error("Failed to fetch user books", err);
      } finally {
        console.log('Finished fetching books');
        setLoading(false);
      }
    };
  
    fetchBooks();
  }, [bookUpdateKey]);
  

  const trimTags = (tags?: string[] | string): string => {
    let tagArray: string[] = [];
  
    if (typeof tags === 'string') {
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          tagArray = parsed;
        }
      } catch (e) {
        return '🤷‍♀️ Invalid tags format';
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
      await deleteUserBook(id)
      setUserBooks(prevBooks => prevBooks.filter(book => book.user_book_id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Failed to delete a book");
      } else {
        setError("An unknown error occurred");
      }
    }
  }


  const rows = userBooks.length > 0 ? userBooks.map((item, index) => (

    <Table.Row key={index}>
      <Table.Cell>
        <VStack gap={10} mr={4}>
          <Box boxSize="4">
          <Button variant="outline" size="sm" onClick={() => deleteBook(item.user_book_id)}>
            <TrashIcon />
          </Button>
          </Box>
          <Box boxSize="4">
          <Button variant="outline" size="sm">
            <PencilIcon />
          </Button>
          </Box>
        </VStack>
    </Table.Cell>
      <Table.Cell>
        <Image src={!item.image_url ||item.image_url === "default" ? default_book : item.image_url} h="200px"
          maxW={150}
          fit="contain"/>
      </Table.Cell>
      <Table.Cell>{item.isbn}</Table.Cell>
      <Table.Cell w={150}>{item.title}</Table.Cell>
      <Table.Cell w={4}>{item.author}</Table.Cell>
      <Table.Cell>{item.year}</Table.Cell>
      <Table.Cell>{item.language}</Table.Cell>
      <Table.Cell  w={3}>{item.genre}</Table.Cell>
      <Table.Cell w={3}>
        {trimTags(item.tags)}
      </Table.Cell>
      <Table.Cell>{item.page_count}</Table.Cell>
      <Table.Cell w={150} textAlign="center">{item.rating ? convertRating(item.rating) : convertRating(0)}</Table.Cell>
      <Table.Cell w={4}>{item.month_of_reading}</Table.Cell>
      <Table.Cell  w={4}>{item.year_of_reading}</Table.Cell>
      <Table.Cell>{item.comment}</Table.Cell>
    </Table.Row>
  )) : (
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