import { useEffect, useState } from 'react'
import { getYearlyStats } from '../../api/stats';
import { Box, SimpleGrid, Card, CardHeader, Text, Spinner } from '@chakra-ui/react';

const YearlyStats = () => {
  const [yearlyStats, setYearlyStats] = useState<Record<string, {
    totalBooks: number;
    totalPages: number;
    totalLanguages: Record<string, number>;
    totalRating: Record<string, number>;
  }>>({});

  useEffect(() => {
    const fetchData = async () => {
      const stats = await getYearlyStats();
      setYearlyStats(stats);
    };

    fetchData();
  }, []);

  if (!yearlyStats) return <Spinner
    color="red.500"
    css={{ "--spinner-track-color": "colors.gray.200" }}
  />;

  const renderRating = (ratingData: Record<string, number>) => {
    const ratings = [5, 4, 3, 2, 1];
    return ratings.map((star) => (
      <Box key={star} display="flex" alignItems="center">
        <Text fontSize="sm" width="40px" textAlign="center">{ratingData[star] || 0}</Text>
        <Text>{"⭐".repeat(star)}</Text>
      </Box>
    ));
  };

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} p={4}>
        {Object.entries(yearlyStats).reverse().map(([year, stats]) => (
          <Card.Root key={year} boxShadow="md" p={4} m={2} >
            <CardHeader>
              <Card.Title fontSize="xl" fontWeight="bold">
                {year}
              </Card.Title>
            </CardHeader>
            <Card.Body>
              <Text>Totalt antal böcker: {stats.totalBooks}</Text>
              <Text>Totalt antal sidor: {stats.totalPages}</Text>
              <Text>Språk:</Text>
              <Box pl={4}>
                {Object.entries(stats.totalLanguages).map(([language, count]) => (
                  <Text key={language}>{language}: {count}</Text>
                ))}
              </Box>

              <Text>Betyg:</Text>
              <Box pl={4}>
                {renderRating(stats.totalRating)}
              </Box>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default YearlyStats