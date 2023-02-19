<script setup>
import {onBeforeMount} from 'vue'

const store = useMemoryGameStore()

const cardBackSrc = '/card_back.png'
const cardFlipped = ref({})
let isFlipping = false


onBeforeMount(async () => {
  await store.init()

  store.selectedCards.forEach((card) => {
    cardFlipped.value[card.id] = false
  })
})

const flipCard = (card) => {
  cardFlipped.value[card.id] = true
  store.flip(card)

  // Check if two cards are picked, and they don't match
  if (store.pickedCards.length === 2) {
    const card1 = store.selectedCards.find((c) => c.id === store.pickedCards[0])
    const card2 = store.selectedCards.find((c) => c.id === store.pickedCards[1])
    if (card1.code !== card2.code) {
      // Delay flipping the cards back over for a moment to let the user see the cards
      setTimeout(() => {
        cardFlipped.value[card1.id] = false
        cardFlipped.value[card2.id] = false
        store.pickedCards = []

        // Check if lives count is 0, and redirect to home page if so
        if (store.lives === 0) {
          window.location.href = '/'
        }
      }, 1000)
    } else {
      store.pickedCards = []
    }
  }
}
</script>

<template>

  <div v-if="store.loading" class="w-screen h-screen flex justify-center items-center">
    <Loader/>
  </div>

  <div
      class="absolute inset-0 -z-10"
      style="
        background-image: url('/bg2.jpg');
        background-size: cover;
        background-position: center;
      "
  ></div>

  <div class="h-screen w-screen flex flex-col flex-nowrap z-10">
    <div class="w-max-full flex flex-4 justify-between items-center pt-6 pl-6 pr-6">
      <div class="text-lg text-white font-semibold	">Lives: {{ store.lives }}</div>
      <div>Score: {{ store.score }}</div>
    </div>

    <div v-if="!store.loading" class="flex flex-1 justify-center items-center p-2 pl-6 pr-6">

      <div class="w-full bg-green-600 grid grid-cols-6 grid-rows-3 gap-2" style=" border-radius: 24px">
        <img
            v-for="card in store.selectedCards"
            :key="card.id"
            :alt="card.code"
            :src="cardFlipped[card.id] ? card.image : cardBackSrc"
            class="object-cover justify-self-center items-center"
            height="200"
            @click="flipCard(card)"
        />
      </div>
    </div>

    <div class="flex flex-4 items-center pb-6 pl-6 pr-6">
      <nuxt-link to="/">
        <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
          &#x25c0 Home
        </button>
      </nuxt-link>
    </div>
  </div>
</template>
