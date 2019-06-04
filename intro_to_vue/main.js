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
                variantColour: "green"
            },
            {
                variantID: 2235,
                variantColour: "blue"
            }
        ]
    }
})
