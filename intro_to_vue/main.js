// ---------- a global channel that listen to events ----
var eventBus = new Vue()

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

        <product-tabs :reviews="reviews"></product-tabs> 

  
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

            variants: [{
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
            reviews: [],
        }
    },

    methods: {
        // anonymous functions:
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID) // emit and event to parent, the event is named 'add-to-cart'
        },
        updateProduct(index) { // ES6 format
            this.selectedVariant = index
            console.log(index)
        },
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
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }

});

// ------ start of 'product-review' component (nested in 'product' component) -------------------
Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit"> 
    <!--event listener with a prevent modifier to prevent the default behaviour, i.e. the page wont refresh when form is submitted 
        action can be posting to an external API-->

    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
    </p>

    <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
    </p>
    <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
    </p>
    <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">  <!-- .number is a modifier to ensure the type class of the option value is a number -->
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
    </p>
    <p>
        <input type="submit" value="OK">
    </p>
    </form>
    `,
    data() {
        return {
            name: null, // name data is updated by v-model
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        
        onSubmit() {
            if (this.name && this.review && this.rating) { // Execute onSubmit only when all fields are filled-in
                let productReview = { // create an object when click submit
                    name: this.name, // name from this data
                    review: this.review,
                    rating: this.rating
                }
                // post this object to parent
                eventBus.$emit('review-submitted', productReview) // then go back to where the <product-review> is nested to receive the emit event
                // reset the values after submitting the form, form values are stored in the prodictReview object
                this.name = null
                this.review = null
                this.rating = null
            }
            else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Write your review.")
                if(!this.rate) this.errors.push("Rate the product.")
            }
         }
    }
})
// ----------------------------- end of 'product-review' component ---------------------------------------

// ----------------------------- start of 'product-tabs' component --------------------------------

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <span class="tab"
                :class="{ activeTab: selectedTab === tab}"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab">
                {{ tab }}</span>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                <p>{{ review.name }}</p>
                <p>Rating: {{ review.rating }}</p>
                <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>

        <product-review v-show="selectedTab === 'Make a Review'"></product-review> 
                
    </div>


    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

// ----------------------------- end of 'product-tabs' component ----------------------------------

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id) // refers to cart in the data
        }
    }

})