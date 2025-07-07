import { Box, Container, Flex, Button, Icon, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { GiTreeBranch } from 'react-icons/gi';
import { FaHome, FaFeatherAlt } from 'react-icons/fa';

export const Header = () => {
  return (
    <Box as="nav" w="100%" bg="slate.800" boxShadow="lg" position="sticky" top={0} zIndex={10}>
      <Container maxW="container.xl">
        <Flex h="16" alignItems="center" justifyContent="space-between">
          <Flex gap={6} align="center">
            <Link to="/">
              <Button 
                variant="ghost" 
                fontWeight="bold"
                leftIcon={<Icon as={FaHome} />}
                _hover={{
                  transform: 'translateY(-2px)',
                  color: 'green.400'
                }}
                transition="all 0.2s"
              >
                Home
              </Button>
            </Link>
            <Link to="/lists">
              <Button 
                variant="ghost"
                leftIcon={<Icon as={GiTreeBranch} color="green.400" />}
                _hover={{
                  transform: 'translateY(-2px)',
                  color: 'green.400'
                }}
                transition="all 0.2s"
              >
                <Flex align="center" gap={1}>
                  <Text>My Trees</Text>
                  <Icon 
                    as={FaFeatherAlt} 
                    color="orange.400" 
                    transform="rotate(-45deg)"
                    boxSize={3}
                    ml={-1}
                    mt={-2}
                  />
                </Flex>
              </Button>
            </Link>
          </Flex>
          <Box>
            <Text color="green.400" fontWeight="bold">
              WordPecker App
            </Text>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}; 