import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Container, Text, VStack, useToast } from "@chakra-ui/react";
import { FaArrowUp } from "react-icons/fa";

const BIRD_SIZE = 20;
const GRAVITY = 6;
const JUMP_HEIGHT = 50;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 200;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;

const Index = () => {
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);
  const toast = useToast();

  const handleJump = useCallback(() => {
    let newBirdPosition = birdPosition - JUMP_HEIGHT;
    if (newBirdPosition < 0) {
      newBirdPosition = 0;
    }
    setBirdPosition(newBirdPosition);
  }, [birdPosition]);

  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
      timeId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + GRAVITY);
      }, 24);
    }
    return () => {
      clearInterval(timeId);
    };
  }, [birdPosition, gameHasStarted]);

  useEffect(() => {
    let obstacleId;
    if (gameHasStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 24);
      return () => {
        clearInterval(obstacleId);
      };
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
      setScore((score) => score + 1);
    }
  }, [gameHasStarted, obstacleLeft]);

  useEffect(() => {
    const hasCollidedWithTopObstacle = birdPosition >= 0 && birdPosition < obstacleHeight;
    const hasCollidedWithBottomObstacle = birdPosition <= GAME_HEIGHT && birdPosition >= GAME_HEIGHT - (GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight);
    const hasCollidedWithObstacle = obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle);

    if (hasCollidedWithObstacle || birdPosition >= GAME_HEIGHT - BIRD_SIZE) {
      setGameHasStarted(false);
      setScore(0);
      setBirdPosition(GAME_HEIGHT / 2);
      toast({
        title: "Game Over",
        description: "You have collided with an obstacle.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [birdPosition, obstacleHeight, obstacleLeft, toast]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Flappy Bird</Text>
        <Box position="relative" width={`${GAME_WIDTH}px`} height={`${GAME_HEIGHT}px`} bg="blue.100" overflow="hidden">
          <Box position="absolute" top={`${birdPosition}px`} left="50px" width={`${BIRD_SIZE}px`} height={`${BIRD_SIZE}px`} bg="yellow.400" borderRadius="50%" />
          <Box position="absolute" top="0" left={`${obstacleLeft}px`} width={`${OBSTACLE_WIDTH}px`} height={`${obstacleHeight}px`} bg="green.400" />
          <Box position="absolute" top={`${obstacleHeight + OBSTACLE_GAP}px`} left={`${obstacleLeft}px`} width={`${OBSTACLE_WIDTH}px`} height={`${GAME_HEIGHT - obstacleHeight - OBSTACLE_GAP}px`} bg="green.400" />
        </Box>
        <Text fontSize="xl">Score: {score}</Text>
        <Button onClick={() => setGameHasStarted(true)} colorScheme="teal" size="lg">
          Start Game
        </Button>
        <Button onClick={handleJump} colorScheme="yellow" size="lg" leftIcon={<FaArrowUp />}>
          Jump
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;
