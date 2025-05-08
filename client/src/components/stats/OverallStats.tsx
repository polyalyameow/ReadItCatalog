import { Box, SimpleGrid, Card, CardHeader, CardBody, Stat, StatHelpText, Text, Spinner } from '@chakra-ui/react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import React, { useEffect, useState } from 'react'
import { getGeneralStats } from '../../api/stats';

interface GeneralStats {
  totalBooks: number;
  totalPages: number;
  totalLanguages: Record<string, number>;
  totalRating: Record<string, number>;
}

const OverallStats = () => {
  const [generalStats, setGeneralStats] = useState<GeneralStats>({
    totalBooks: 0,
    totalPages: 0,
    totalLanguages: {},
    totalRating: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      const stats = await getGeneralStats();
      setGeneralStats(stats);
    };

    fetchData();
  }, []);

  if (!generalStats) return <Spinner
    color="red.500"
    css={{ "--spinner-track-color": "colors.gray.200" }}
  />;

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} p={4}>
        <Card.Root boxShadow="md" p={4}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold">Totalt antal böcker</Text>
          </CardHeader>
          <CardBody>
            <Stat.Root>
              <Stat.ValueText>{generalStats?.totalBooks}</Stat.ValueText>
              <StatHelpText>Tillagda böcker</StatHelpText>
            </Stat.Root>
          </CardBody>
        </Card.Root>

        <Card.Root boxShadow="md" p={4}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold">Totalt antal sidor</Text>
          </CardHeader>
          <CardBody>
            <Stat.Root>
              <Stat.ValueText>{generalStats?.totalPages}</Stat.ValueText>
              <StatHelpText>Lästa sidor</StatHelpText>
            </Stat.Root>
          </CardBody>
        </Card.Root>

        <Card.Root boxShadow="md" p={4}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="bold">Språk</Text>
          </CardHeader>
          <CardBody>
            {Object.entries(generalStats?.totalLanguages || {}).map(([language, count]) => (
              <Text key={language}>{language}: {count as number}</Text>
            ))}
          </CardBody>
        </Card.Root>
      </SimpleGrid>

      <Text fontSize="xl" fontWeight="bold" mb={4}>Betygsfördelning</Text>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={[
              { name: "5 Stars", value: generalStats?.totalRating[5] || 0 },
              { name: "4 Stars", value: generalStats?.totalRating[4] || 0 },
              { name: "3 Stars", value: generalStats?.totalRating[3] || 0 },
              { name: "2 Stars", value: generalStats?.totalRating[2] || 0 },
              { name: "1 Star", value: generalStats?.totalRating[1] || 0 },
            ]}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            fill="#8884d8"
          >
            {[
              "#805AD5", "#63B3ED", "#F6AD55", "#F56565", "#FEB2B2"
            ].map((color, index) => (
              <Cell key={index} fill={color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default OverallStats