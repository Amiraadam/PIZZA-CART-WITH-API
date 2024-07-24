document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            messagePay: '',
            message: 'PLEASE LOGIN HERE BEFORE PLACING AN ORDER!',
            username: '',
            pizzas: [],
            featuredpizzas: [],
            cartId: '',
            cart: { total: 0 },
            paymentMessage: '',
            payNow: false,
            paymentAmount: 0,
            change: 0,
            loggedIn: false,
          

            logIn() {
                localStorage.setItem('username', this.username);
                this.createCart().then(cart => {
                    this.cartId = cart.data.cart_code;
                    localStorage.setItem('cartId', cart.data.cart_code);
                    if (this.username.length > 3) {
                        this.loggedIn = true;
                     
                    } 
                    else if (this.username.length <= 3) {
                        alert("Please enter a valid name!");
                    }        
                })
            },
            
            logOut() {
                localStorage.removeItem('username');
                localStorage.removeItem('cartId');
                this.loggedIn = false;
                this.cart = { total: 0 };
                this.username = '';
                this.message = 'PLEASE LOGIN HERE BEFORE PLACING AN ORDER!';
               
            },

            init() {
                axios
                .get('https://pizza-api.projectcodex.net/api/pizzas')
                .then((result) => {
                    this.pizzas = result.data.pizzas;
                })
                then(() => {
                    return this.createCart();
                })
                .then((result) => {
                    this.cartId = result.data.cart_code;
                });
            },

            featuredPizzas() {
                return axios
                  .get('https://pizza-api.projectcodex.net/api/pizzas/featured')
            },

            postfeaturedPizzas() {
                return axios
                  .post('https://pizza-api.projectcodex.net/api/pizzas/featured')
              },

            createCart() {
                return axios
                .get('https://pizza-api.projectcodex.net/api/pizza-cart/create?username=' + this.username);
            },

            showCart() {
                const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
               
                axios
                .get(url)
                .then((result) => {
                    this.cart = result.data;
                });
            },

            add(pizza) {
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }

                axios
                .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', params)
                    .then(() => {
                        this.message = "You added an item";
                        this.showCart();
                    })
                    .then(() => {

                        return this.featuredPizzas();
                    })
                    .then(() => { 

                        return this.postfeaturedPizzas();
                    })
                    .catch(err => alert(err));
            },
            remove(pizza) {
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }

                    axios
                    .post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', params)
                        .then(() => {
                            this.message = "you removed an item";
                            this.showCart();
                    })
                    .catch(err => alert(err));
                },

                fetchOredrHistory() {
                    const url = 'https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/history';
                    axios.get(url)
                        then((res) => {
                            console.log(result.data.orders);
                         this.History = result = reslut.data.orders;
                         console.log(this.History);
                    })
                    .catch(err => alert(err));
                },

                pay(pizza) {
                    const params = {
                        cart_code: this.cartId,
                    }
                    console.log(typeof(this.paymentAmount));
                    console.log(this.cart.total);

                    axios
                    .post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', params)
                        .then(() => {
                            if (!Number(this.paymentAmount)) {
                                this.paymentMessage = 'Please enter an amount based on your purchase';
                            }
                          
                                else if (Number(this.paymentAmount) >= this.cart.total) {
                                this.change = (Number(this.paymentAmount) - this.cart.total).toFixed(2);
                                this.paymentMessage = `Payment successful! Your change is R${this.change}.`;
                                this.messagePay = `${this.username} made a successful purchase! Enjoy your food`
                                setTimeout(() => {
                                    this.cart.total = 0
                                    this.paymentAmount = 0;
                                    this.change = 0;
                                    window.location.reload(); 
                                }, 5000);

                            } else if (this.paymentAmount < this.cart.total) {
                            this.paymentMessage = 'Insufficient funds! .'
                        }                         
                        })
                    .catch(err => alert(err));
                }
            }           
        });
    })
          
        
   