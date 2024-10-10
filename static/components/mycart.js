const Mycart=Vue.component("mycart",{
    template:   
            `<div>
                    <div>
                        <h4>Order Summary</h4>
                        <h5>Total items:{{totalitems}}</h5>
                        <h5>Total Price:{{totalprice}}</h5>
                    </div>
                    <div>
                    <table class="table table-striped">
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">total Price</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="i in items" :key="i.id">
                        <td>{{i.id}}</td>
                        <td>{{i.product}}</td>
                        
                        <td>{{i.quantity}}</td>
                        <td>{{i.price}}</td>
                        <td><button @click="remove(i.id)" type="button" class="btn btn-danger">Remove</button></td>
                        
                      </tr>
                      
                    </tbody>
                  </table>
                  <button @click="alert">place order</button>
                    </div>

            </div>`,
            data(){
                return{
                    user:localStorage.getItem('user'),
                    items:[],
                }
            },
            mounted:function(){
                    fetch(`/${this.user}/mycart`,{headers:{'Authentication-Token':localStorage.getItem('token')}})
                    .then(response=>response.json()).then(data=>{console.log(data);this.items=data})
            },
            methods:{
                remove(id){
                    fetch(`/${id}/cancelbooking`).then(response=>response.json()).then(data=>{console.log(data);this.$router.replace(`/${this.user}/mycart`)})
                    
                },
                alert:function(){
                    window.alert('order placed successfully')
                    fetch(`/${this.user}/order_placed`).then(response=>response.json()).then(data=>{console.log(data);
                    this.$router.push('/categories')})
                }

                },
            computed:{
                totalprice(){
                    let sum=0;
                    for(let i=0;i<this.items.length;i++){
                        sum+=this.items[i].price
                    }
                    return sum;
                },
                totalitems(){
                    let items=this.items.length;
                    return items;
                }
                
            }    
            
})
export default Mycart