import {
    Box,
    Card,
    Text,
    Stack,
    HStack,
    Spinner,
    SimpleGrid,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { getMonthlyStats } from "../api/stats";

const MonthlyStats = () => {
    const [stats, setStats] = useState<Record<string, {
        totalBooks: number;
        totalPages: number;
        totalLanguages: Record<string, number>;
        totalRating: Record<string, number>;
    }>>({});

    useEffect(() => {
        const fetchStats = async () => {
            const result = await getMonthlyStats();
            setStats(result);
        };
        fetchStats();
    }, []);

    if (!stats) return <Spinner
        color="red.500"
        css={{ "--spinner-track-color": "colors.gray.200" }}
    />;

    return (
        <Box p={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={6}>
                Monthly Stats
            </Text>
            <SimpleGrid templateColumns="repeat(auto-fill, minmax(350px, 1fr))" p={4}>
                {Object.keys(stats).map((month, index) => {
                    const monthData = stats[month];

                    const languageData = Object.keys(monthData.totalLanguages).map(
                        (language) => ({
                            name: language,
                            value: monthData.totalLanguages[language],
                        })
                    );
                    const ratingData = Object.keys(monthData.totalRating).map(
                        (rating) => ({
                            name: `Rating: ${rating}`,
                            value: monthData.totalRating[rating],
                        })
                    );

                    return (
                        <Box key={index}>
                            <Card.Root>
                                <Card.Body>
                                    <Card.Title>
                                        {month}
                                    </Card.Title>

                                    <Stack mt={4}>
                                        <Text fontWeight="bold">
                                            Total Books: {monthData.totalBooks}
                                        </Text>
                                        <Text fontWeight="bold">
                                            Total Pages: {monthData.totalPages}
                                        </Text>

                                        <Text fontWeight="bold" mt={2}>
                                            Languages:
                                        </Text>
                                        {languageData.length ? (
                                            <Box pl={4}>
                                                {languageData.map((lang, i) => (
                                                    <Text key={i} fontSize="sm">
                                                        {lang.name}: {lang.value}
                                                    </Text>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Text pl={4} fontSize="sm">
                                                No language data
                                            </Text>
                                        )}

                                        <Text fontWeight="bold" mt={2}>
                                            Ratings:
                                        </Text>
                                        {ratingData.length ? (
                                            <Box pl={4}>

                                                {[5, 4, 3, 2, 1].map((rating) => {
                                                    const count = monthData.totalRating[rating] || 0;
                                                    const stars = "⭐".repeat(Number(rating));

                                                    return (
                                                        <HStack key={rating} p={2}>
                                                            <Text fontSize="sm" width="40px" textAlign="center">{count}</Text>
                                                            <Text fontSize="sm">{stars}</Text>
                                                        </HStack>
                                                    );
                                                })}
                                            </Box>
                                        ) : (
                                            <Text pl={4} fontSize="sm">
                                                No ratings
                                            </Text>
                                        )}
                                    </Stack>
                                </Card.Body>
                            </Card.Root>
                        </Box>
                    );
                })}
            </SimpleGrid>
        </Box>
    );
};

export default MonthlyStats;
