import { Box, Button, HStack } from '@chakra-ui/react'
import { useState } from 'react'
import OverallStats from '../components/stats/OverallStats';
import MonthlyStats from '../components/stats/MonthlyStats';
import YearlyStats from '../components/stats/YearlyStats';

const StatsPage = () => {
  const [view, setView] = useState<"overall" | "yearly" | "monthly">("overall");

  return (
    <>
      <HStack p={4} mb={4}>
        <Button
          variant={view === "overall" ? "solid" : "outline"}
          onClick={() => setView("overall")}
        >
          Övergripande statistik
        </Button>
        <Button
          variant={view === "yearly" ? "solid" : "outline"}
          onClick={() => setView("yearly")}
        >
          Årlig statistik
        </Button>
        <Button
          variant={view === "monthly" ? "solid" : "outline"}
          onClick={() => setView("monthly")}
        >
          Månadsstatistik
        </Button>
      </HStack>

      <Box>
        {view === "overall" && <OverallStats />}
        {view === "yearly" && <YearlyStats />}
        {view === "monthly" && <MonthlyStats />}
      </Box>
    </>
  );
}

export default StatsPage