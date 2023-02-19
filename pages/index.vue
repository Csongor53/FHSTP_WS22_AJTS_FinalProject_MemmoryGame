<script setup>
const store = useMemoryGameStore()
</script>

<template>
  <div
    class="bg-gray-100 min-h-screen relative flex flex-col justify-center items-center"
  >
    <div
      class="absolute inset-0"
      style="
        background-image: url('/home_background.jpg');
        background-size: cover;
      "
    ></div>
    <div
      class="flex flex-col flex-nowrap justify-center items-center bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full mx-auto relative"
      style="z-index: 1"
    >
      <h1 class="text-4xl font-bold mb-8 text-gray-900">Welcome to My Game</h1>
      <p class="text-lg text-gray-700 mb-8">
        Get ready for an exciting adventure!
      </p>

      <div class="flex justify-center gap-2 mt-8">
        <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full p-4"
            @click="store.lives = 20"
        >
          Easy
        </button>
        <button
            class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full p-4"
            @click="store.lives = 15"
        >
          Normal
        </button>
        <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full p-4"
            @click="store.lives = 10"
        >
          Hard
        </button>
      </div>

      <nuxt-link to="/game" class="mt-1">
        <button
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Start Game
        </button>
      </nuxt-link>
    </div>
  </div>
</template>
