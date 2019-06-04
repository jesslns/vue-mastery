Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">

    <div class="product-image">
        <img v-bind:src="image" />
    </div>

    <div class="product-info">
        <h1>{{ title }}</h1> <!-- also works with {{brand}}{{product}}-->
        <p v-if="inStock">In Stock</p>
        <p v-else>Out of Stock</p>
        <p>Shipping: {{ shipping }}</p>
        <!-- <p v-if="inventory >10">In Stock</p>
        <p v-else-if="inventory <=10 && inventory > 0 ">Almost sold out!</p>
        <p v-else>Out of Stock</p> -->

        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <!-- use index of each variant object within variants, instead of v-for="variant in variants" -->
        <div v-for="(variant, index) in variants" 
                :key="variant.variantID"
                class="color-box"
                :style="{ backgroundColor: variant.variantColour }" 
                @mouseover="updateProduct(index)">

            <!-- backgroundColor (or can be replaced using CSS syntax with quotation 'background-color') 
                is the CSS property to be added, other example include fontSize/ 'font-size'.
                on the right variant.variantColour is referencing to the data -->
            <!-- For clearner expression, bind style to say styleObject
                <p :style="styleObject">...</p>
                and declare 
                styleObject: {
                    color: 'red',
                    fontSize: '13px'
                } 
                in data in main.js

                similarly, for class
                <div :class="active">...</div>
                and declare 
                classObject: {
                    active: true,
                    'text-danger': false
                }
            -->
            <!-- <p @mouseover="updateProduct(variant.variantImage)">{{ variant.variantColour }}</p>  -->
            <!--@ is a short-hand for v-on
                : is a short-hand for v-bind -->
        </div>

        <!-- <button v-on:click="cart +=1">Add to Cart</button>  -->
        <!-- when function get more complicated it is better to seperate as a method -->
        <button v-on:click="addToCart" 
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }" 
                >Add to Cart</button>          
                
        <!-- disabledButton will be added when inStock is false, dynamically adding class to div -->


    </div>

    
    </div>
    `,

    data() {
        return {
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
                    variantQuantity: 1
                },
                {
                    variantID: 2235,
                    variantColour: "blue",
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 8
                }
            ],

        }
    }, 

    methods: {
        // ----------- anonymous functions
        addToCart: function () { 
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID) // emit and event to parent, the event is named 'add-to-cart'
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
        },
        shipping() {
            if (this.premium) {
                return "Free"
            } else
            return "$100"
        }
    }

});

var app = new Vue({
    el: '#app',
    data:{
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)  // refers to cart in the data
        }
    }

})
