var app = new Vue({
    el: '#app',
    data: {
        brand: 'Vue Mastery',
        product: 'Socks',
        // image: "./assets/vmSocks-green-onWhite.jpg",
        // to update more than just image:
        selectedVariant: 0,
        // inventory: 100
        details: ["80% cotton", "20% polyester", "size 23-25"],

        variants: [
            {
                variantID: 2234,
                variantColour: "green",
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 0
            },
            {
                variantID: 2235,
                variantColour: "blue",
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 8
            }
        ],

        cart: 0
    },
    methods: {
        // ----------- anonymous function
        addToCart: function () { 
            this.cart +=1  // refers to cart in the data
        },
        updateProduct(index) {  // ES6 format
            this.selectedVariant = index
            console.log(index)
        }
    },
    computed: {
        title() {
          return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        }
    }
})
