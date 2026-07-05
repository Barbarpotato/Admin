// Core Modules
import { Box, Grid, Tooltip, Flex, Text } from '@chakra-ui/react';

// Builds a GitHub-contribution-style calendar: one column per week, one row per
// weekday, colored by how many activity events (e.g. deployments) fell on that day.
function buildCells(dates, weeks) {
    const countByDay = {};
    dates.forEach((raw) => {
        const day = new Date(raw);
        if (isNaN(day)) return;
        day.setHours(0, 0, 0, 0);
        const key = day.toISOString().slice(0, 10);
        countByDay[key] = (countByDay[key] || 0) + 1;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Extend to the end of this week (Saturday) so full columns line up,
    // then walk back `weeks` full Sun-Sat weeks from there.
    const end = new Date(today);
    end.setDate(end.getDate() + (6 - end.getDay()));
    const start = new Date(end);
    start.setDate(start.getDate() - (weeks * 7 - 1));

    const cells = [];
    for (let i = 0; i < weeks * 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        cells.push({
            date: d,
            key,
            // days after today haven't happened yet - render them as blank, not "no activity"
            count: d > today ? null : (countByDay[key] || 0),
        });
    }
    return cells;
}

function colorFor(count) {
    if (count === null) return 'transparent';
    // Distinct from the surrounding card background (#383a4a) so empty days
    // still read as a visible, "dark" cell instead of blending into the card.
    if (count <= 0) return '#292b37';
    if (count === 1) return '#866bab';
    return '#cc7bc9';
}

function ActivityHeatmap({ dates = [], weeks = 17 }) {
    const cells = buildCells(dates, weeks);

    return (
        <Flex direction={'column'} gap={2}>
            <Box overflowX={'auto'} py={1}>
                <Grid
                    templateColumns={`repeat(${weeks}, 12px)`}
                    templateRows={'repeat(7, 12px)'}
                    gridAutoFlow={'column'}
                    gap={'3px'}
                    w={'fit-content'}
                >
                    {cells.map((cell) => (
                        <Tooltip
                            key={cell.key}
                            label={cell.count === null ? '' : `${cell.count} activity on ${cell.date.toDateString()}`}
                            fontSize={'xs'}
                            isDisabled={cell.count === null}
                        >
                            <Box w={'12px'} h={'12px'} borderRadius={'2px'} bg={colorFor(cell.count)} />
                        </Tooltip>
                    ))}
                </Grid>
            </Box>
            <Flex align={'center'} gap={2} fontSize={'xs'} color={'#c0c0c0'}>
                <Text>Less</Text>
                <Box w={'12px'} h={'12px'} borderRadius={'2px'} bg={'#292b37'} />
                <Box w={'12px'} h={'12px'} borderRadius={'2px'} bg={'#866bab'} />
                <Box w={'12px'} h={'12px'} borderRadius={'2px'} bg={'#cc7bc9'} />
                <Text>More</Text>
            </Flex>
        </Flex>
    );
}

export default ActivityHeatmap;
