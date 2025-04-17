import { Table, Spinner, Text, Box, HStack, Image, Button, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { getUserBooks } from '../api/user'
import { UserAndBookRow } from '../../../types/types'
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import default_book from '../../../server/img/default_book.jpg'

const MyBooks = () => {

  // const [selection, setSelection] = useState<string[]>([])
  const [userBooks, setUserBooks] = useState<UserAndBookRow[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
  


  const rows = userBooks.length > 1 ? userBooks.map((item, index) => (

    <Table.Row key={index}>
      {/* <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(item.name)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.name]
                : selection.filter((name) => name !== item.name),
            )
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell> */}
      <Table.Cell>
        <HStack gap={10}>
          <Box boxSize="4">
          <Button variant="outline" size="sm">
            <TrashIcon />
          </Button>
          </Box>
          <Box boxSize="4">
          <Button variant="outline" size="sm">
            <PencilIcon />
          </Button>
          </Box>
        </HStack>
    </Table.Cell>
      <Table.Cell>
        <Image src={item.image_url !== '""' ? item.image_url : default_book} h="200px"
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
{/* 
    <ActionBar.Root open={hasSelection}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content>
            <ActionBar.SelectionTrigger>
              {selection.length} selected
            </ActionBar.SelectionTrigger>
            <ActionBar.Separator />
            <Button variant="outline" size="sm">
              Delete <Kbd>⌫</Kbd>
            </Button>
            <Button variant="outline" size="sm">
              Share <Kbd>T</Kbd>
            </Button>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root> */}
  </>)}
  </>
  )
}

export default MyBooks