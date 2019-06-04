var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        image: "./assets/vmSocks-green-onWhite.jpg",
        inStock: true,
        // inventory: 100
        details: ["80% cotton", "20% polyester", "size 23-25"],

        variants: [
            {
                variantID: 2234,
                variantColour: "green",
                variantImage: "./assets/vmSocks-green-onWhite.jpg"
            },
            {
                variantID: 2235,
                variantColour: "blue",
                variantImage: "./assets/vmSocks-blue-onWhite.jpg"
            }
        ],

        cart: 0
    },
    methods: {
        // ----------- anonymous function
        addToCart: function () { 
            this.cart +=1  // refers to cart in the data
        },
        updateProduct(variantImage) {  // ES6 format
            this.image = variantImage
        }
    }
})
