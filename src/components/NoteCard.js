import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  GridItem,
  Grid,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  VStack,
  Divider,
} from '@chakra-ui/react';
import ClassImage from '../img/classImage.jpg';
import { useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { useState } from 'react';
import Reply from './Reply';

export default function NoteCard({
  id,
  title,
  body,
  messageDate,
  username,
  comments,
}) {
  const [message, setMessage] = useState('');
  

  const navigate = useNavigate();
  const [showReply, setShowReply] = useState(false);
  const onReplyClicked = async () => {
    if (showReply && message.length !== 0) {
      const request = await fetch('/api/v1/comment', {
        headers: {
          'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ message, note_id: id }),
      });
      const data = await request.json();
      window.location.reload(false);
    }
    setShowReply(!showReply);
  };

  const onCloseClicked = () => {
    setShowReply(false);
    onClose();
  };

  const onCloseButtonClick = () => {
    setShowReply(false);
    onClose();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Center py={6}>
        <Box
          minWidth={'250px'}
          maxW={'320px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.900')}
          boxShadow={'2xl'}
          rounded={'lg'}
          p={6}
          textAlign={'center'}
        >
          <Avatar
            size={'xl'}
            src={ClassImage}
            alt={'Avatar Alt'}
            mb={4}
            pos={'relative'}
            _after={{
              content: '""',
              w: 4,
              h: 4,
              bg: 'green.300',
              border: '2px solid white',
              rounded: 'full',
              pos: 'absolute',
              bottom: 0,
              right: 3,
            }}
          />
          <HStack
            w="full"
            alignItems="center"
            justifyContent="center"
            spacing={4}
          >
            <Heading fontSize={'xl'} fontFamily={'body'}>
              {title}
            </Heading>
          </HStack>
          <Text my={6}>{/\d{4}-\d{2}-\d{2}/.exec(messageDate)[0]}</Text>
          <Text fontWeight={600} mb={4}>
            Posted by: @{username}
          </Text>

          <Stack mt={8} direction={'row'} spacing={4}>
            <Button
              onClick={onOpen}
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
              bg={'blue.400'}
              color={'white'}
              boxShadow={
                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
              }
              _hover={{
                bg: 'blue.500',
              }}
              _focus={{
                bg: 'blue.500',
              }}
            >
              Open
            </Button>
          </Stack>
        </Box>
      </Center>
        <Modal
          variant="wide"
          closeOnOverlayClick={false}
          isOpen={isOpen}
          onClose={onCloseButtonClick}
        >
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(6px) hue-rotate(20deg)"
          />
          <ModalContent width="100%">
            <VStack align="left">
              <ModalHeader>{title}</ModalHeader>
              <ModalCloseButton />
              <HStack spacing={2} height={title.length * 5}>
                <Text m={5}>{body}</Text>
              </HStack>
            </VStack>

            <ModalBody px={0} pt={0} pb={6}>
              {comments.length > 0 ? (
                <>
                  <Divider mt={5} />
                  <Grid templateColumns="repeat(1, 1fr)" gap={1}>
                    {comments.map((comment, index) => {
                      return (
                        <GridItem key={index} w="100%" h="100%">
                          <Comment
                            key={index}
                            message={comment.message}
                            messageDate={comment.messageDate}
                            username={comment.user.username}
                          />
                        </GridItem>
                      );
                    })}
                  </Grid>
                </>
              ) : (
                <></>
              )}
              {showReply && <Reply message={message} setMessage={setMessage} />}
            </ModalBody>

            <ModalFooter>
              <Button mx={5} onClick={onReplyClicked}>
                Reply
              </Button>
              <Button onClick={onCloseClicked}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </>
  );
}
