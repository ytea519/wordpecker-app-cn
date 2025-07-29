import { 
  Box, 
  Button, 
  Text, 
  Flex, 
 
  IconButton, 
  useDisclosure, 
  Container, 
  Heading, 
  Icon,
  useToast,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  FormControl,
  FormLabel,
  VStack
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Word, WordList } from '../types';
import { ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaGraduationCap, FaGamepad, FaPlus, FaBookOpen, FaMicrophone } from 'react-icons/fa';
import { GiTreeBranch } from 'react-icons/gi';
import { AddWordModal } from '../components/AddWordModal';
import { ProgressIndicator, OverallProgress } from '../components/ProgressIndicator';
// Voice agent modal component removed - now using dedicated page
import { apiService } from '../services/api';
import { UserPreferences } from '../types';

// Animation keyframes removed for build compatibility

// Dynamic color generator
const generateColor = (word: string) => {
  // Generate a hue based on the word's characters
  const hue = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  // Use fixed saturation and lightness for consistency
  return `hsl(${hue}, 70%, 25%)`;
};

// Generate hover color (slightly lighter version)
const generateHoverColor = (word: string) => {
  if (!word) return `hsl(0, 70%, 30%)`;
  const hue = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  return `hsl(${hue}, 70%, 30%)`;
};

const MotionBox = motion(Box);

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const ListDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [list, setList] = useState<WordList | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lightReadingLevel, setLightReadingLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [generatingReading, setGeneratingReading] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  
  const { 
    isOpen: isReadingModalOpen, 
    onOpen: onReadingModalOpen, 
    onClose: onReadingModalClose 
  } = useDisclosure();

  // Voice agent modal state removed - now using dedicated page

  useEffect(() => {
    const fetchListDetails = async () => {
      if (!id) return;
      
      try {
        // Fetch list details, words, and user preferences in parallel
        const [listData, wordsData, preferencesData] = await Promise.all([
          apiService.getList(id),
          apiService.getWords(id),
          apiService.getPreferences()
        ]);
        
        setList(listData);
        setWords(wordsData);
        setUserPreferences(preferencesData);
      } catch (error) {
        console.error('Error fetching list details:', error);
        toast({
          title: 'Error loading list',
          description: 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/lists');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListDetails();
  }, [id, navigate, toast]);

  const handleAddWord = async (word: string): Promise<void> => {
    try {
      const newWord = await apiService.addWord(id!, word);
      setWords(prevWords => [newWord, ...prevWords]);
      toast({
        title: '单词添加成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      console.error('Error adding word:', error);
      toast({
        title: '添加单词失败',
        description: '请稍后再试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteWord = async (wordId: string) => {
    try {
      await apiService.deleteWord(id!, wordId);
      setWords(prevWords => prevWords.filter(word => word.id !== wordId));
      toast({
        title: '单词删除成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting word:', error);
      toast({
        title: '删除单词失败',
        description: '请稍后再试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteList = async () => {
    if (!id || !window.confirm('确定要删除该列表吗？此操作无法撤销。')) return;
    
    try {
      await apiService.deleteList(id);
      toast({
        title: '列表删除成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/lists');
    } catch (error) {
      console.error('Error deleting list:', error);
      toast({
        title: '删除列表失败',
        description: '请稍后再试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenerateLightReading = async () => {
    if (!id || words.length === 0) return;
    
    setGeneratingReading(true);
    try {
      const reading = await apiService.generateLightReading(id, lightReadingLevel);
      
      // Navigate to a new reading page with the generated content
      navigate(`/reading/${id}`, { 
        state: { 
          reading, 
          list, 
          level: lightReadingLevel 
        } 
      });
      
      onReadingModalClose();
    } catch (error) {
      console.error('Error generating light reading:', error);
      toast({
        title: '生成阅读失败',
        description: '请稍后再试',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setGeneratingReading(false);
    }
  };

  if (isLoading) {
    return (
      <Center h="calc(100vh - 64px)">
        <Spinner size="xl" color="green.400" thickness="4px" />
      </Center>
    );
  }

  if (!list) {
    return (
      <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
        <Box textAlign="center" py={10}>
          <Text>未找到该词汇列表</Text>
          <Button 
            onClick={() => navigate('/lists')} 
            mt={4}
            colorScheme="green"
          >
            返回列表
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
        p={4}
      >
        <Flex mb={6} justify="space-between" align="center">
          <Flex align="center" gap={2}>
            <IconButton
              aria-label="Go back"
              icon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => navigate(-1)}
              size="lg"
              _hover={{
                transform: 'translateY(-2px)',
                color: 'green.400'
              }}
              transition="all 0.2s"
            />
            <Heading 
              as="h1" 
              size="xl"
              bgGradient="linear(to-r, green.400, brand.400)"
              bgClip="text"
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Icon 
                as={GiTreeBranch} 
                color="green.400"
                style={{ animation: 'sparkle 3s ease infinite' }}
              />
              {list.name}
            </Heading>
          </Flex>
          <IconButton
            aria-label="Delete list"
            icon={<DeleteIcon />}
            variant="ghost"
            colorScheme="red"
            onClick={handleDeleteList}
            size="lg"
            _hover={{
              bg: 'red.900',
              transform: 'scale(1.1)'
            }}
            transition="all 0.2s"
          />
        </Flex>

        {/* Overall Progress Section */}
        {words.length > 0 && (
          <Box mb={6}>
            <OverallProgress words={words} size="md" />
          </Box>
        )}
        
        <Flex 
          justify="space-between" 
          align="center" 
          mb={6}
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Box maxW="container.md">
            <Text color="gray.400" fontSize="lg">{list.description}</Text>
            {list.context && (
              <Text color="gray.500" fontSize="md" mt={2}>
                Context: {list.context}
              </Text>
            )}
          </Box>
          <Flex gap={3} flexWrap="wrap" justify={{ base: 'center', md: 'flex-end' }}>
            <Button 
              variant="ghost" 
              leftIcon={<FaGraduationCap />}
              colorScheme="green"
              _hover={{ 
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
              size="lg"
              isDisabled={words.length === 0}
              onClick={() => navigate(`/learn/${list!.id}`, { state: { list } })}
            >
              学习
            </Button>
            <Button 
              variant="ghost"
              leftIcon={<FaGamepad />}
              colorScheme="orange"
              _hover={{ 
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
              size="lg"
              isDisabled={words.length === 0}
              onClick={() => navigate(`/quiz/${list!.id}`, { state: { list } })}
            >
              测验
            </Button>
            <Button 
              variant="ghost"
              leftIcon={<FaBookOpen />}
              colorScheme="purple"
              _hover={{ 
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
              size="lg"
              isDisabled={words.length === 0}
              onClick={onReadingModalOpen}
            >
              简易阅读
            </Button>
            <Button 
              variant="ghost"
              leftIcon={<FaMicrophone />}
              colorScheme="blue"
              _hover={{ 
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
              size="lg"
              isDisabled={words.length === 0}
              onClick={() => navigate(`/voice-chat/${list!.id}`, { 
                state: { 
                  config: {
                    listId: list!.id,
                    listName: list!.name,
                    listContext: list!.context,
                    userLanguages: {
                      baseLanguage: userPreferences?.baseLanguage || 'English',
                      targetLanguage: userPreferences?.targetLanguage || 'English'
                    }
                  },
                  listName: list!.name
                } 
              })}
            >
              语音聊天
            </Button>
            <Button 
              variant="solid"
              colorScheme="green"
              leftIcon={<FaPlus />}
              _hover={{ 
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
              size="lg"
              onClick={onOpen}
            >
              添加单词
            </Button>
          </Flex>
        </Flex>

        <Box 
          bg="slate.800"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="slate.700"
          overflow="hidden"
          _hover={{ borderColor: 'slate.600' }}
          transition="all 0.2s"
        >
          {words.length === 0 ? (
            <Flex 
              direction="column" 
              align="center" 
              gap={4} 
              py={12}
              px={4}
            >
              <Icon 
                as={GiTreeBranch} 
                boxSize={12} 
                color="green.400" 
                style={{ animation: 'sparkle 3s ease infinite' }}
              />
              <Text color="gray.400" fontSize="lg" textAlign="center">
                这棵词汇树还是空的，添加单词让它成长吧 🌱
              </Text>
              <Button
                variant="outline"
                colorScheme="green"
                leftIcon={<FaPlus />}
                onClick={onOpen}
                size="lg"
                _hover={{
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.2s"
              >
                添加你的第一个单词
              </Button>
            </Flex>
          ) : (
            <Box p={4}>
              {words.map((word: Word, index: number) => (
                <MotionBox
                  key={word.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    x: 10,
                    backgroundColor: generateHoverColor(word.value),
                  }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    type: "tween",
                    ease: "easeOut"
                  }}
                  onClick={() => navigate(`/words/${word.id}`)}
                  p={4}
                  mb={2}
                  borderRadius="lg"
                  bg={generateColor(word.value)}
                  position="relative"
                  cursor="pointer"
                >
                  <Flex justify="space-between" align="center">
                    <Box w="full">
                      <Text 
                        fontSize="xl" 
                        fontWeight="bold" 
                        color="white"
                        mb={2}
                      >
                        {word.value}
                      </Text>
                      
                      {/* Progress Indicator */}
                      <Box mb={selectedWord === word.id ? 3 : 2}>
                        <ProgressIndicator 
                          learnedPoint={word.learnedPoint || 0} 
                          size="sm" 
                          showLabel={true}
                          showBadge={true}
                        />
                      </Box>
                      
                      {selectedWord === word.id && (
                        <Text 
                          color="gray.200" 
                          fontSize="md"
                          transition="all 0.3s"
                        >
                          {word.meaning}
                        </Text>
                      )}
                    </Box>
                    <Box
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setSelectedWord(word.id);
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        if (selectedWord !== word.id) {
                          setSelectedWord(null);
                        }
                      }}
                    >
                      <IconButton
                        aria-label="Delete word"
                        icon={<DeleteIcon />}
                        variant="ghost"
                        colorScheme="red"
                        opacity={selectedWord === word.id ? 1 : 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWord(word.id);
                        }}
                        _hover={{
                          transform: 'scale(1.1)',
                        }}
                        transition="all 0.2s"
                      />
                    </Box>
                  </Flex>
                </MotionBox>
              ))}
            </Box>
          )}
        </Box>

        <AddWordModal
          isOpen={isOpen}
          onClose={onClose}
          onAddWord={handleAddWord}
          listName={list?.name || ''}
        />

        {/* Light Reading Level Selection Modal */}
        <Modal isOpen={isReadingModalOpen} onClose={onReadingModalClose} size="md">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Flex align="center" gap={2}>
                <FaBookOpen color="purple" />
                <Text color="purple.400">生成简易阅读</Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" color="gray.400">
                  使用 "{list?.name}" 中的词汇生成个性化阅读材料。
                  请选择难度等级：
                </Text>
                
                <FormControl>
                  <FormLabel color="purple.300">阅读难度</FormLabel>
                  <Select 
                    value={lightReadingLevel} 
                    onChange={(e) => setLightReadingLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                    bg="slate.700"
                    borderColor="slate.600"
                    _focus={{ borderColor: 'purple.400' }}
                  >
                    <option value="beginner">初级 - 简单句子和基础词汇</option>
                    <option value="intermediate">中级 - 语句自然、难度适中</option>
                    <option value="advanced">高级 - 复杂句子和高级用语</option>
                  </Select>
                </FormControl>

                <Box p={3} bg="purple.50" borderRadius="md" borderLeft="4px solid" borderColor="purple.400">
                  <Text fontSize="sm" color="purple.700">
                    💡 阅读材料将包含 {Math.min(12, words.length)} 个随机选择的单词
                    {words.length > 12 && `（共 ${words.length} 个）`}，并结合相关情境文章
                    {list?.context && `（主题：${list.context}）`}。
                  </Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onReadingModalClose}>
                取消
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleGenerateLightReading}
                isLoading={generatingReading}
                loadingText="正在生成阅读材料..."
                leftIcon={<FaBookOpen />}
              >
                生成阅读
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Voice Agent Modal removed - now using dedicated page at /voice-chat/:listId */}
      </MotionBox>
    </Container>
  );
}; 