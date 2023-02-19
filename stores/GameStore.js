import {defineStore, acceptHMRUpdate} from 'pinia'

const cardAPI = 'https://deckofcardsapi.com/api/deck/'

export const useMemoryGameStore = defineStore('MemoryGameStore', {
    state() {
        return {
            deckId: null,
            selectedCards: [],
            pickedCards: [],
            lives: 15,
            score: 0,
            loading: true,
        }
    },
    getters: {
        drawCardApi: (state) => {
            return `${cardAPI}${state.deckId}/draw/?count=9`
        },
        getDeckApi: () => {
            return `${cardAPI}new/shuffle/?deck_count=1`
        },
        shuffleDeckApi: (state) => {
            return `${cardAPI}${state.deckId}/shuffle/`
        },
    },
    actions: {
        async init() {
            try {
                const {deck_id} = await fetch(this.getDeckApi).then((r) => r.json())
                this.deckId = deck_id
                const drawResult = await fetch(this.drawCardApi).then((r) => r.json())
                const cards = drawResult.cards

                // Duplicate cards, -> selectedCards
                const duplicatedCards = cards.flatMap((card, index) => [
                    { ...card, id: `pair1-${index}` },
                    { ...card, id: `pair2-${index}` },
                ])

                // Shuffle array
                for (let i = duplicatedCards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1))
                    ;[duplicatedCards[i], duplicatedCards[j]] = [
                        duplicatedCards[j],
                        duplicatedCards[i],
                    ]
                }

                this.selectedCards = []
                this.selectedCards = duplicatedCards
                this.loading = false

                console.log('Init result:')
                console.log(this.selectedCards)
            } catch (error) {
                console.log(error)
            }
        },
        flip(card) {
            // Check if the card has already been picked
            if (this.pickedCards.includes(card.id)) {
                return
            }

            // Add the card to the pickedCards array
            this.pickedCards.push(card.id)

            // Check if there are two picked cards
            if (this.pickedCards.length === 2) {
                const card1 = this.selectedCards.find((c) => c.id === this.pickedCards[0])
                const card2 = this.selectedCards.find((c) => c.id === this.pickedCards[1])

                // Check if the two picked cards match
                if (card1.code === card2.code) {
                    this.score++
                } else {
                    this.lives--
                    setTimeout(() => {
                        this.pickedCards.forEach((id) => {
                            const index = this.selectedCards.findIndex((c) => c.id === id)
                            this.selectedCards[index].flipped = false
                        })
                        this.pickedCards = []
                    }, 1000)
                    return // added this to stop the function from continuing when the cards don't match
                }

                // Clear the pickedCards array
                this.pickedCards = []
            } else {
                const index = this.selectedCards.findIndex((c) => c.id === card.id)
                this.selectedCards[index].flipped = true
            }
        },
    },
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMemoryGameStore, import.meta.hot))
}
